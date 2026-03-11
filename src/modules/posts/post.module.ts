import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { LoggingModule } from '../shared/logging/logging.module';
import { TagModule } from '../tags/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLitePostEntity } from './infrastructure/entities/post.sqlite.entity';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from './application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from './application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { AddTagToPostUseCase } from './application/use-cases/add-tag-to-post.use-case';
import { RemoveTagFromPostUseCase } from './application/use-cases/remove-tag-from-post.use-case';
import { PostRepository } from './domain/repositories/post.repository';
import { PostController } from './infrastructure/controllers/post.controller';
// import { InMemoryPostRepository } from './infrastructure/repositories/post.in-memory.repository';
import { SQLitePostRepository } from './infrastructure/repositories/post.sqlite.repository';
import { SubmitPostForReviewUseCase } from './application/use-cases/submit-post-for-review-use-case';
import { ApprovePostUseCase } from './application/use-cases/approve-post-use-case';
import { RejectPostUseCase } from './application/use-cases/reject-post-use-case';

@Module({
  imports: [
    AuthModule,
    LoggingModule,
    TagModule,
    TypeOrmModule.forFeature([SQLitePostEntity]),
  ],
  controllers: [PostController],
  providers: [
    {
      provide: PostRepository,
      useClass: SQLitePostRepository,
    },

    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    GetPostsUseCase,
    GetPostByIdUseCase,
    AddTagToPostUseCase,
    RemoveTagFromPostUseCase,
    SubmitPostForReviewUseCase,
    ApprovePostUseCase,
    RejectPostUseCase,
  ],
  exports: [PostRepository],
})
export class PostModule {}
