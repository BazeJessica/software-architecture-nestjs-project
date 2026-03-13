import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({
    description: 'The unique name of the tag',
    example: 'typescript',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'name must contain only lowercase alphanumeric characters and hyphens',
  })
  name: string;
}

