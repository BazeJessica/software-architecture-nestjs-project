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
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
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
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetPostBySlugUseCase } from '../../application/use-cases/get-post-by-slug.use-case';
import { UpdatePostSlugUseCase } from '../../application/use-cases/update-post-slug-use-case';
import { SubmitPostForReviewUseCase } from '../../application/use-cases/submit-post-for-review-use-case';
import { ApprovePostUseCase } from '../../application/use-cases/approve-post-use-case';
import { RejectPostUseCase } from '../../application/use-cases/reject-post-use-case';

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
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  public async getPosts(@Query('tags') tags?: string) {
    const posts = await this.getPostsUseCase.execute(tags);

    return posts.map((p) => p.toJSON());
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return post by ID.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  public async getPostById(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    const post = await this.getPostByIdUseCase.execute(id, user);

    return post?.toJSON();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  public async createPost(
    @Requester() user: UserEntity,
    @Body() input: Omit<CreatePostDto, 'authorId'>,
  ) {
    const post = await this.createPostUseCase.execute(
      { ...input, authorId: user.id },
      user,
    );
    return post.toJSON();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Post deleted successfully.' })
  public async deletePost(@Param('id') id: string) {
    return this.deletePostUseCase.execute(id);
  }

  @Patch(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Post submitted for review.' })
  public async submitPostForReview(@Param('id') id: string) {
    return this.submitPostForReviewUseCase.execute(id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Post approved.' })
  public async approvePost(@Param('id') id: string) {
    return this.approvePostUseCase.execute(id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Post rejected.' })
  public async rejectPost(@Param('id') id: string) {
    return this.rejectPostUseCase.execute(id);
  }

  @Get('slug/:slug')
  @ApiResponse({ status: 200, description: 'Post found by slug.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  public async getPostBySlug(@Param('slug') slug: string) {
    const post = await this.getPostBySlugUseCase.execute(slug);
    return post.toJSON();
  }

  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Slug updated successfully.' })
  public async updatePostSlug(
    @Param('id') id: string,
    @Body('slug') slug: string,
  ) {
    await this.updatePostSlugUseCase.execute(id, slug);
  }

  @Post(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Tag added to post.' })
  public async addTagToPost(
    @Param('id') postId: string,
    @Param('tagId') tagId: string,
  ) {
    await this.addTagToPostUseCase.execute({ postId, tagId });
  }

  @Delete(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Tag removed from post.' })
  public async removeTagFromPost(
    @Param('id') postId: string,
    @Param('tagId') tagId: string,
  ) {
    await this.removeTagFromPostUseCase.execute({ postId, tagId });
  }
}
