import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { SQLiteUserEntity } from '../entities/user.sqlite.entity';

@Injectable()
export class SQLiteUserRepository implements UserRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async listUsers(): Promise<UserEntity[]> {
    const users = await this.dataSource.getRepository(SQLiteUserEntity).find({ relations: ['following', 'followers'] });

    return users.map((user) => UserEntity.reconstitute({ 
      ...user,
      following: user.following?.map(f => f.id) || [],
      followers: user.followers?.map(f => f.id) || [],
    }));
  }

  public async getUserById(id: string): Promise<UserEntity | undefined> {
    const user = await this.dataSource
      .getRepository(SQLiteUserEntity)
      .findOne({ where: { id }, relations: ['following', 'followers'] });

    if (!user) return undefined;

    return UserEntity.reconstitute({ 
      ...user,
      following: user.following?.map(f => f.id) || [],
      followers: user.followers?.map(f => f.id) || [],
    });
  }

  public async createUser(input: UserEntity): Promise<void> {
    const json = input.toJSON();
    await this.dataSource.getRepository(SQLiteUserEntity).save({
      id: json.id as string,
      username: json.username as string,
      role: json.role as any,
      password: json.password as string,
    });
  }

  public async updateUser(id: string, input: UserEntity): Promise<void> {
    const json = input.toJSON();
    const repo = this.dataSource.getRepository(SQLiteUserEntity);
    
    const entity = await repo.preload({
      id,
      username: json.username as string,
      role: json.role as any,
      password: json.password as string,
      following: (json.following as string[]).map(fid => ({ id: fid } as SQLiteUserEntity)),
    });
    
    if (entity) {
      await repo.save(entity);
    }
  }

  public async deleteUser(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteUserEntity).delete(id);
  }
}
