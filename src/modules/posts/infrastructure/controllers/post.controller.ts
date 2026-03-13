import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../../shared/auth/infrastructure/guards/optional-jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { UpdatePostDto } from '../../application/dtos/update-post.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from '../../application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from '../../application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case';
import { AddTagToPostUseCase } from '../../application/use-cases/add-tag-to-post.use-case';
import { RemoveTagFromPostUseCase } from '../../application/use-cases/remove-tag-from-post.use-case';
import { ApiResponse, ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetPostBySlugUseCase } from '../../application/use-cases/get-post-by-slug.use-case';
import { UpdatePostSlugUseCase } from '../../application/use-cases/update-post-slug-use-case';
import { SubmitPostForReviewUseCase } from '../../application/use-cases/submit-post-for-review-use-case';
import { ApprovePostUseCase } from '../../application/use-cases/approve-post-use-case';
import { RejectPostUseCase } from '../../application/use-cases/reject-post-use-case';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly addTagToPostUseCase: AddTagToPostUseCase,
    private readonly removeTagFromPostUseCase: RemoveTagFromPostUseCase,
    private readonly getPostBySlugUseCase: GetPostBySlugUseCase,
    private readonly updatePostSlugUseCase: UpdatePostSlugUseCase,
    private readonly submitPostForReviewUseCase: SubmitPostForReviewUseCase,
    private readonly approvePostUseCase: ApprovePostUseCase,
    private readonly rejectPostUseCase: RejectPostUseCase,
  ) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get all posts with optional tag filtering' })
  @ApiResponse({ status: 200, description: 'Return all visible posts.' })
  public async getPosts(
    @Requester() user: UserEntity | undefined,
    @Query('tags') tags?: string
  ) {
    const posts = await this.getPostsUseCase.execute(tags, user);
    return posts.map((p) => p.toJSON());
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  public async createPost(
    @Requester() user: UserEntity,
    @Body() input: CreatePostDto,
  ) {
    const post = await this.createPostUseCase.execute(
      { ...input, authorId: user.id },
      user,
    );
    return post.toJSON();
  }

  @Get(':slugOrId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get a post by slug or ID' })
  @ApiResponse({ status: 200, description: 'Return post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  public async getPost(
    @Requester() user: UserEntity | undefined,
    @Param('slugOrId') slugOrId: string,
  ) {
    try {
      const post = await this.getPostBySlugUseCase.execute(slugOrId, user);
      return post.toJSON();
    } catch (e) {
      try {
        const post = await this.getPostByIdUseCase.execute(slugOrId, user);
        if (!post) throw e;
        return post.toJSON();
      } catch (innerError) {
        throw e;
      }
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post content' })
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  public async updatePost(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    const post = await this.updatePostUseCase.execute(id, input, user);
    return post.toJSON();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 204, description: 'Post deleted successfully.' })
  public async deletePost(
    @Requester() user: UserEntity,
    @Param('id') id: string
  ) {
    await this.deletePostUseCase.execute(id, user);
  }

  @Patch(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit post for review' })
  public async submitPostForReview(
    @Requester() user: UserEntity,
    @Param('id') id: string
  ) {
    const post = await this.submitPostForReviewUseCase.execute(id, user);
    return post.toJSON();
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a post (Moderator/Admin only)' })
  public async approvePost(
    @Requester() user: UserEntity,
    @Param('id') id: string
  ) {
    const post = await this.approvePostUseCase.execute(id, user);
    return post.toJSON();
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a post (Moderator/Admin only)' })
  public async rejectPost(
    @Requester() user: UserEntity,
    @Param('id') id: string
  ) {
    const post = await this.rejectPostUseCase.execute(id, user);
    return post.toJSON();
  }

  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually update post slug' })
  public async updatePostSlug(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body('slug') slug: string,
  ) {
    const post = await this.updatePostSlugUseCase.execute(id, slug, user);
    return post.toJSON();
  }

  @Post(':postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a tag to a post' })
  public async addTagToPost(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    await this.addTagToPostUseCase.execute({ postId, tagId }, user);
    return { success: true };
  }

  @Delete(':postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a tag from a post' })
  public async removeTagFromPost(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    await this.removeTagFromPostUseCase.execute({ postId, tagId }, user);
  }
}
