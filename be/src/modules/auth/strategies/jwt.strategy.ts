import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserVerifyStatus } from '../../../common/enums';
import { UserDocument } from '../../users/schemas';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  user_id?: string; // Dùng dấu ? vì có thể có hoặc không
  sub?: string; // Thêm sub của đồng đội vào đây
  email: string;
  role: string;
  token_type?: number;
  verify: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('jwt.accessTokenSecret') ||
        configService.get<string>('JWT_SECRET_ACCESS_TOKEN') ||
        'default_secret',
    });
  }

  async validate(payload: JwtPayload) {
    // 1. Lấy ID an toàn: Ưu tiên user_id của bạn, nếu không có thì lấy sub
    const userId = payload.user_id || payload.sub;

    if (!userId) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    // 2. Ép kiểu UserDocument để truy cập isActive mà không bị báo lỗi "Unsafe member access"
    const user = (await this.usersService.findById(userId)) as UserDocument & {
      isActive?: boolean;
    };

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // 3. Kiểm tra trạng thái (Gộp cả 2 bên)
    const isBanned = user.verify === UserVerifyStatus.Banned;
    const isInactive = user.isActive === false;

    if (isBanned || isInactive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa hoặc không hoạt động');
    }

    // 4. Trả về object đã đồng bộ hóa hoàn toàn
    return {
      userId: userId, // Dùng cho code của bạn
      sub: userId, // Dùng cho code của đồng đội
      id: userId, // Dự phòng thêm
      email: payload.email,
      role: payload.role,
      verify: payload.verify,
    };
  }
}
