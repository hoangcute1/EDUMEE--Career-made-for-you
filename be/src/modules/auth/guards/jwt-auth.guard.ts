import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any): any {
    // Log the error for debugging
    if (err || !user) {
      let errorMessage = 'User not found in token';
      
      if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String((err as Record<string, unknown>).message);
      } else if (info && typeof info === 'object' && 'message' in info) {
        errorMessage = String((info as Record<string, unknown>).message);
      }
      
      console.error('JWT Auth Error:', errorMessage);
      throw new UnauthorizedException(errorMessage);
    }
    
    return user;
  }
}