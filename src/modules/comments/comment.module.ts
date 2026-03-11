import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../posts/post.module';
import { SQLiteCommentEntity } from './infrastructure/entities/comment.sqlite.entity';
import { SQLiteCommentRepository } from './infrastructure/repositories/comment.sqlite.repository';
import { CommentsController } from './infrastructure/controllers/comments.controller';
import { COMMENT_REPOSITORY_TOKEN } from './domain/repositories/comment.repository';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { GetCommentsForPostUseCase } from './application/use-cases/get-comments-for-post.use-case';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteCommentEntity]), PostModule],
  controllers: [CommentsController],
  providers: [
    {
      provide: COMMENT_REPOSITORY_TOKEN,
      useClass: SQLiteCommentRepository,
    },
    CreateCommentUseCase,
    GetCommentsForPostUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
  ],
  exports: [COMMENT_REPOSITORY_TOKEN],
})
export class CommentModule {}
