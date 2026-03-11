import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case';
import { SQLiteTagRepository } from './infrastructure/repository/tag.sqlite.repository';
import { SQLiteTagEntity } from './infrastructure/entity/tag.sqlite.entity';
import { TagsController } from './infrastructure/controller/tag.controller';
import { GetTagUseCase } from './application/use-cases/get-tag.use-case';
import { TAG_REPOSITORY_TOKEN } from './domain/repository/tag.repository';
import { TagCreatedEvent } from './domain/event/tag-created.event';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteTagEntity])],
  controllers: [TagsController],
  providers: [
    {
      provide: TAG_REPOSITORY_TOKEN,
      useClass: SQLiteTagRepository,
    },
    CreateTagUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
    GetTagUseCase,
  ],
  exports: [TAG_REPOSITORY_TOKEN, TypeOrmModule, TagCreatedEvent],
})
export class TagModule {}
