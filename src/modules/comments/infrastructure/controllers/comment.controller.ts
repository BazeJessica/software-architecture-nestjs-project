import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
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
@Controller()
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getCommentsForPostUseCase: GetCommentsForPostUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly countCommentUseCase: CountCommentUseCase,
  ) {}

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiResponse({ status: 201, description: 'Created comment successfully.' })
  async create(
    @Param('postId') postId: string,
    @Requester() user: UserEntity,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.createCommentUseCase.execute({
      postId,
      content: dto.content,
      authorId: user.id,
    });
    return comment.toJSON();
  }

  @Get('posts/:postId/comments')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({ status: 200, description: 'List of comments.' })
  async findAll(@Param('postId') postId: string) {
    const comments = await this.getCommentsForPostUseCase.execute(postId);
    return comments.map((c) => c.toJSON());
  }

  @Get('posts/:postId/comments/count')
  @ApiOperation({ summary: 'Get comment count for a post' })
  @ApiResponse({ status: 200, description: 'Count of comments.' })
  async count(@Param('postId') postId: string) {
    const count = await this.countCommentUseCase.execute(postId);
    return { postId, count };
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Updated comment successfully.' })
  async update(
    @Param('id') id: string,
    @Requester() user: UserEntity,
    @Body() dto: UpdateCommentDto,
  ) {
    const comment = await this.updateCommentUseCase.execute({
      commentId: id,
      content: dto.content,
      requesterId: user.id,
    });
    return comment.toJSON();
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
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
