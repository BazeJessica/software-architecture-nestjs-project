import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreateTagDto } from '../../application/dtos/create-tags.dto';
import { UpdateTagDto } from '../../application/dtos/update-tags.dto';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { UpdateTagUseCase } from '../../application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.use-case';
import { GetTagUseCase } from '../../application/use-cases/get-tag.use-case';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
    private readonly getTagUseCase: GetTagUseCase,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Tag created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid name format.' })
  @ApiResponse({ status: 409, description: 'Tag name already exists.' })
  async create(
    @Requester() user: UserEntity,
    @Body() createTagDto: CreateTagDto,
  ) {
    const tag = await this.createTagUseCase.execute(createTagDto, user);
    return tag.toJSON();
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of tags.' })
  async findAll() {
    const tags = await this.getTagUseCase.execute();
    return {
      tags: tags.map((tag) => tag.toJSON()),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Tag updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid name format.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @ApiResponse({ status: 409, description: 'New name already exists.' })
  async update(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    const tag = await this.updateTagUseCase.execute(
      id,
      {
        name: updateTagDto.name,
      },
      user,
    );
    return tag.toJSON();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Tag deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async remove(@Requester() user: UserEntity, @Param('id') id: string) {
    await this.deleteTagUseCase.execute(id, user);
  }
}
