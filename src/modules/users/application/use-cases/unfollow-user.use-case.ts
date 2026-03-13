import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class UnfollowUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(followerId: string, followingId: string): Promise<void> {
    const follower = await this.userRepository.getUserById(followerId);
    if (!follower) throw new NotFoundException('Follower not found');

    const following = await this.userRepository.getUserById(followingId);
    if (!following) throw new NotFoundException('User to unfollow not found');

    follower.unfollow(followingId);
    await this.userRepository.updateUser(followerId, follower);
  }
}
