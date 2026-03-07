import { Injectable } from '@nestjs/common';
import { LoggingService } from 'src/modules/shared/logging/domain/services/logging.service';

@Injectable()
export class DeleteTagUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string): Promise<void> {
    this.loggingService.log('DeleteTagUseCase.execute');
    await this.tagRepository.deleteTag(id);
  }
}
