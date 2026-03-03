import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { LoggingModule } from '../shared/logging/logging.module';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from './application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from './application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { PostRepository } from './domain/repositories/post.repository';
import { PostController } from './infrastructure/controllers/post.controller';
// import { InMemoryPostRepository } from './infrastructure/repositories/post.in-memory.repository';
import { SQLitePostRepository } from './infrastructure/repositories/post.sqlite.repository';

@Module({
  imports: [AuthModule, LoggingModule],
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
  ],
})
export class PostModule {}
