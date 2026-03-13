import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class GetFollowingUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserEntity[]> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const following: UserEntity[] = [];
    for (const followingId of user.following) {
      const f = await this.userRepository.getUserById(followingId);
      if (f) following.push(f);
    }
    
    return following;
  }
}
