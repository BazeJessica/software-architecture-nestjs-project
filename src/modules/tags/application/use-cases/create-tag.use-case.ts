import { Injectable } from '@nestjs/common';
import { TagEntity } from '../../domain/entities/tag.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { CreateTagDto } from '../dtos/creaye-tags.dto';
import { UserCannotCreateTagException } from '../../domain/exceptions/user-cannot-create-tag.exception';
import { TagRepository } from '../../domain/repository/tag.repository';
import { TagCreatedEvent } from '../../domain/event/tag-created.event';

@Injectable()
export class CreateTagUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tagRepository: TagRepository,
  ) {}
  public async execute(
    input: CreateTagDto,
    user: UserEntity,
  ): Promise<TagEntity> {
    if (!user.permissions.tags.canCreate()) {
      throw new UserCannotCreateTagException();
    }
    const name = input.name.toLowerCase();
    const existingTag = await this.tagRepository.findByName(name);
    if (existingTag) {
      throw new Error(`Tag with name ${name} already exists`);
    }
    const tag = TagEntity.create(input.name);
    await this.tagRepository.createTag(tag);

    this.eventEmitter.emit(TagCreatedEvent, {
      tagId: tag.id,
      name: input.name,
    });

    return tag;
  }
}
