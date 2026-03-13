import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserRepository } from './modules/users/domain/repositories/user.repository';
import { UserEntity } from './modules/users/domain/entities/user.entity';
import { PostRepository } from './modules/posts/domain/repositories/post.repository';
import { PostEntity } from './modules/posts/domain/entities/post.entity';
import { TagRepository } from './modules/tags/domain/repository/tag.repository';
import { TagEntity } from './modules/tags/domain/entities/tag.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get(UserRepository);
  const postRepository = app.get(PostRepository);
  const tagRepository = app.get(TagRepository);

  console.log('Seeding database...');

  // 1. Create Users
  const admin = UserEntity.create('admin_user', 'admin', process.env.SEED_USER_PASSWORD || 'password000');
  const moderator = UserEntity.create('mod_user', 'moderator', process.env.SEED_USER_PASSWORD || 'password000');
  const writer = UserEntity.create('writer_user', 'writer', process.env.SEED_USER_PASSWORD || 'password000');
  const reader = UserEntity.create('reader_user', 'user', process.env.SEED_USER_PASSWORD || 'password000');

  await userRepository.createUser(admin);
  await userRepository.createUser(moderator);
  await userRepository.createUser(writer);
  await userRepository.createUser(reader);

  // 2. Create Tags
  const tagTs = TagEntity.create('typescript');
  const tagNode = TagEntity.create('nodejs');
  const tagArch = TagEntity.create('architecture');

  await tagRepository.createTag(tagTs);
  await tagRepository.createTag(tagNode);
  await tagRepository.createTag(tagArch);

  // 3. Create Posts
  const post1 = PostEntity.create('Architecture Patterns', 'Modern web architecture patterns...', writer.id);
  post1.addTag(tagArch);
  post1.addTag(tagTs);

  const post2 = PostEntity.create('NestJS Deep Dive', 'Exploring NestJS internals...', writer.id);
  post2.addTag(tagNode);
  post2.addTag(tagTs);

  const post3 = PostEntity.create('Testing Strategies', 'Comprehensive guide to testing...', writer.id);

  // Set statuses
  post1.submitForReview(); // waiting
  post2.submitForReview();
  post2.approve(); // accepted
  // post3 remains draft

  await postRepository.createPost(post1);
  await postRepository.createPost(post2);
  await postRepository.createPost(post3);

  console.log('Seed completed successfully!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
