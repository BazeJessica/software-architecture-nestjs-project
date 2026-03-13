import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class FollowUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const follower = await this.userRepository.getUserById(followerId);
    if (!follower) throw new NotFoundException('Follower not found');

    const following = await this.userRepository.getUserById(followingId);
    if (!following) throw new NotFoundException('User to follow not found');

    follower.follow(followingId);
    await this.userRepository.updateUser(followerId, follower);
  }
}
