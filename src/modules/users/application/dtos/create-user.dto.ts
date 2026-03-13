import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import type { UserRole } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username', example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'User role', enum: ['user', 'moderator', 'admin', 'writer'], example: 'writer' })
  @IsEnum(['user', 'moderator', 'admin', 'writer'])
  role: UserRole;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}
