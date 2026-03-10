import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../domain/repository/tag.repository';
import { LoggingService } from 'src/modules/shared/logging/domain/services/logging.service';
import { TagEntity } from '../../domain/entities/tag.entity';

@Injectable()
export class GetTagUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(): Promise<TagEntity[]> {
    this.loggingService.log('GetTagUseCase.execute');
    return this.tagRepository.findAll();
  }
}
