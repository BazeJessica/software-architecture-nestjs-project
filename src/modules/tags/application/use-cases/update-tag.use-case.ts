import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
@Injectable()
export class UpdateTagUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, input: UpdateTagDto): Promise<void> {
    this.loggingService.log('UpdateTagUseCase.execute');
    const tag = await this.tagRepository.getTagById(id);

    if (tag) {
      tag.update(input.name, input.length);
      await this.tagRepository.updateTag(id, tag);
    }
  }
}
