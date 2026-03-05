import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';
import { UserRole } from '../../common/enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: Partial<User & { role: UserRole }>;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const createUserDto = {
      email: registerDto.email,
      password: registerDto.password,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role || UserRole.USER,
    };

    const user = await this.usersService.create(createUserDto);
    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    await this.usersService.updateLastLogin(user._id.toString());

    return this.generateAuthResponse(user);
  }

  async validateGoogleUser(profile: {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }): Promise<AuthResponse> {
    let user: UserDocument | null = await this.usersService.findByGoogleId(
      profile.googleId,
    );

    if (!user) {
      user = await this.usersService.findByEmail(profile.email);

      if (user) {
        // Link Google account to existing user
        await this.usersService.update(user._id.toString(), {
          // googleId: profile.googleId, // Would need to add this to UpdateUserDto
        });
      } else {
        // Create new user
        user = await this.usersService.create({
          email: profile.email,
          password: Math.random().toString(36).slice(-16) + 'Aa1!', // Random password for OAuth users
          firstName: profile.firstName,
          lastName: profile.lastName,
        });
      }
    }

    if (!user) {
      throw new UnauthorizedException('Failed to authenticate with Google');
    }

    await this.usersService.updateLastLogin(user._id.toString());
    return this.generateAuthResponse(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.usersService.findById(payload.sub);
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateAuthResponse(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateAuthResponse(user: UserDocument): AuthResponse {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        _id: user._id,
        email: user.email || '',
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || UserRole.USER,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: UserDocument): string {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email || '',
      role: user.role || UserRole.USER,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    });
  }

  private generateRefreshToken(user: UserDocument): string {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email || '',
      role: user.role || UserRole.USER,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });
  }

  getDebugInfo() {
    return {
      jwtConfig: {
        secret: this.configService.get('jwt.secret') ? 'SET' : 'NOT SET',
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
        refreshSecret: this.configService.get('jwt.refreshSecret') ? 'SET' : 'NOT SET',
        refreshExpiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      },
      environment: this.configService.get<string>('NODE_ENV') || 'development',
      database: this.configService.get('DATABASE_URI') ? 'CONFIGURED' : 'NOT CONFIGURED',
      timestamp: new Date().toISOString(),
      tokenFormat: 'Bearer <your-access-token>',
      example: {
        loginFirst: 'POST /api/v1/auth/login',
        thenUseToken: 'Authorization: Bearer <access-token-from-login-response>',
      }
    };
  }
}
