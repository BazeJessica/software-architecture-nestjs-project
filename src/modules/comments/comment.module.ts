import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../posts/post.module';
import { SQLiteCommentEntity } from './infrastructure/entities/comment.sqlite.entity';
import { SQLiteCommentRepository } from './infrastructure/repositories/comment.sqlite.repository';
import { CommentController } from './infrastructure/controllers/comment.controller';
import { COMMENT_REPOSITORY_TOKEN } from './domain/repository/comment.repository';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { GetCommentsForPostUseCase } from './application/use-cases/get-comment.use-case';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';
import { CountCommentUseCase } from './application/use-cases/count-comment.use-case';
import { CommentCleanupListener } from './application/listeners/comment-cleanup.listener';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteCommentEntity]), PostModule],
  controllers: [CommentController],
  providers: [
    {
      provide: COMMENT_REPOSITORY_TOKEN,
      useClass: SQLiteCommentRepository,
    },
    CreateCommentUseCase,
    GetCommentsForPostUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    CountCommentUseCase,
    CommentCleanupListener,
  ],
  exports: [COMMENT_REPOSITORY_TOKEN],
})
export class CommentModule {}
