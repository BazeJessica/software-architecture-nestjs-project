import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case';
import { SQLiteTagRepository } from './infrastructure/repository/tag.sqlite.repository';
import { SQLiteTagEntity } from './infrastructure/entity/tag.sqlite.entity';
import { TagController } from './infrastructure/controller/tag.controller';
import { GetTagUseCase } from './application/use-cases/get-tag.use-case';
import { TAG_REPOSITORY_TOKEN } from './domain/repository/tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteTagEntity])],
  controllers: [TagController],
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
  exports: [TAG_REPOSITORY_TOKEN, TypeOrmModule],
})
export class TagModule {}
