import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post', example: 'My First Post' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The content of the post', example: 'Content here...' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Manual slug override', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  authorId: string;
}
