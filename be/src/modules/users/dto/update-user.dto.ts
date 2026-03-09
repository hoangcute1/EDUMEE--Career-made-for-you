import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateUserDto {
  // ĐÃ ĐỔI: Gộp thành name
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  // ĐÃ ĐỔI: phone -> phone_number
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
  };
}
