import { Injectable } from '@nestjs/common';
import { LoggingService } from 'src/modules/shared/logging/domain/services/logging.service';
import { TagRepository } from '../../domain/repository/tag.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserCannotDeleteTagException } from '../../domain/exceptions/user-cannot-delete-tag.exception';
@Injectable()
export class DeleteTagUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<void> {
    if (!user.permissions.tags.canDelete()) {
      throw new UserCannotDeleteTagException();
    }

    this.loggingService.log('DeleteTagUseCase.execute');
    await this.tagRepository.deleteTag(id);
  }
}
