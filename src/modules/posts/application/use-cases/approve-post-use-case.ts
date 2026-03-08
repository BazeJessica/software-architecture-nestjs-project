import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class ApprovePostUseCase {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    this.loggingService.log('ApprovePostUseCase.execute');
    await this.postRepository.approvePost(id);
  }
}
