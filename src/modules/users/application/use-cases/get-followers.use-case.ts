import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class GetFollowersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserEntity[]> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const followers: UserEntity[] = [];
    for (const followerId of user.followers) {
      const f = await this.userRepository.getUserById(followerId);
      if (f) followers.push(f);
    }
    
    return followers;
  }
}
