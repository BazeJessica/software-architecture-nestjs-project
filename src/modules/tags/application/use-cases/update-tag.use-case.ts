import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagRepository } from '../../domain/repository/tag.repository';
import { UpdateTagDto } from '../dtos/update-tags.dto';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserCannotUpdateTagException } from '../../domain/exceptions/user-cannot-update-tag.exception';
import { TagEntity } from '../../domain/entities/tag.entity';

@Injectable()
export class UpdateTagUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    id: string,
    input: UpdateTagDto,
    user: UserEntity,
  ): Promise<TagEntity> {
    if (!user.permissions.tags.canUpdate()) {
      throw new UserCannotUpdateTagException();
    }

    const name = input.name.toLowerCase();
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new Error(`Tag with id ${id} not found`);
    }

    const existingNameTag = await this.tagRepository.findByName(name);
    if (existingNameTag && existingNameTag.id !== id) {
      throw new Error(`Tag with name ${name} already exists`);
    }

    this.loggingService.log('UpdateTagUseCase.execute');
    const tag = await this.tagRepository.findById(id);

    if (tag) {
      tag.update(input.name);
      await this.tagRepository.updateTag(id, tag);
      return tag;
    }

    throw new Error(`Tag with id ${id} not found`);
  }
}
