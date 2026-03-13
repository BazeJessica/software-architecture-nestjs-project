import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a comment.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}
