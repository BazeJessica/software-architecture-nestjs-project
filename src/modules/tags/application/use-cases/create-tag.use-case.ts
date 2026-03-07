import { Injectable } from "@nestjs/common";
import { TagEntity } from "../../domain/entities/tag.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { CreateTagDto } from "../dtos/creaye-tags.dto";
import { UserCannotCreateTagException } from "../../domain/exceptions/user-cannot-create-tag.exception";

@Injectable()
export class CreateTagUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tagRepository: TagRepository,
  ) {}
  public async execute(input: CreateTagDto, user: UserEntity): Promise<void> {
    if (!user.permissions.posts.canCreate()) {
        throw new UserCannotCreateTagException();
    }

    const tag = TagEntity.create(input.name, input.length);
    await this.tagRepository.createTag(tag);

    this.eventEmitter.emit(TagCreatedEvent, {
      tagId: tag.id,
      name: input.name,
    });
  }
}
