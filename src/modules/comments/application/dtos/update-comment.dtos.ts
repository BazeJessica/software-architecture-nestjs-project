import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Updated content',
    description: 'New text for the comment',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;
}
