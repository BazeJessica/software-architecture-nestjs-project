import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string): Promise<void> {
    this.loggingService.log('DeletePostUseCase.execute');
    await this.postRepository.deletePost(id);
  }
}
