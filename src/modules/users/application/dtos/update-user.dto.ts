import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import type { UserRole } from '../../domain/entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ description: 'New username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'New user role', enum: ['user', 'moderator', 'admin', 'writer'], required: false })
  @IsOptional()
  @IsEnum(['user', 'moderator', 'admin', 'writer'])
  role?: UserRole;
}
