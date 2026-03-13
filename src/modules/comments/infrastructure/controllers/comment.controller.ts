import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { GetCommentsForPostUseCase } from '../../application/use-cases/get-comment.use-case';
import { UpdateCommentUseCase } from '../../application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/delete-comment.use-case';
import { CountCommentUseCase } from '../../application/use-cases/count-comment.use-case';
import { CreateCommentDto } from '../../application/dtos/create-comment.dtos';
import { UpdateCommentDto } from '../../application/dtos/update-comment.dtos';

@ApiTags('Comments')
@Controller('posts/:postId/comments')
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getCommentsForPostUseCase: GetCommentsForPostUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly countCommentUseCase: CountCommentUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created comment successfully.' })
  async create(
    @Param('postId') postId: string,
    @Requester() user: UserEntity,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.createCommentUseCase.execute({
      postId,
      content: dto.content,
      authorId: user?.id ?? '',
    });
    return comment.toJSON();
  }

  @Get()
  @ApiResponse({ status: 200, description: 'All comments for a post' })
  async findAll(@Param('postId') postId: string) {
    const comments = await this.getCommentsForPostUseCase.execute(postId);
    return comments.map((c) => c.toJSON());
  }

  @Get('count')
  @ApiResponse({ status: 200, description: 'Count of all comments for post' })
  async count(@Param('postId') postId: string) {
    const count = await this.countCommentUseCase.execute(postId);
    return { count };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Updated comment successfully.' })
  async update(
    @Param('id') id: string,
    @Requester() user: UserEntity,
    @Body() dto: UpdateCommentDto,
  ) {
    const comment = await this.updateCommentUseCase.execute({
      commentId: id,
      content: dto.content,
      requesterId: user?.id ?? '',
    });
    return comment.toJSON();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Deleted comment successfully.' })
  async remove(
    @Param('id') id: string,
    @Requester() user: UserEntity,
  ) {
    await this.deleteCommentUseCase.execute({
      commentId: id,
      requester: user,
    });
  }
}
