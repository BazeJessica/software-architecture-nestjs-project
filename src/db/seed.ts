/**
 * Database Seed Script
 *
 * Run with: npx ts-node -r tsconfig-paths/register src/db/seed.ts
 *
 * Creates:
 *   - 4 Users (user, writer, moderator, admin)
 *   - 4 Tags
 *   - 4 Posts (draft, pending_review, accepted, rejected)
 *   - 1 Comment on the accepted post
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SQLiteUserEntity } from '../modules/users/infrastructure/entities/user.sqlite.entity';
import { SQLitePostEntity } from '../modules/posts/infrastructure/entities/post.sqlite.entity';
import { SQLiteTagEntity } from '../modules/tags/infrastructure/entity/tag.sqlite.entity';
import { SQLiteCommentEntity } from '../modules/comments/infrastructure/entities/comment.sqlite.entity';
import { SQLiteNotificationEntity } from '../modules/notifications/infrastructure/entities/notification.sqlite.entity';

const dataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_URL ?? 'database.sqlite',
  entities: [
    SQLiteUserEntity,
    SQLitePostEntity,
    SQLiteTagEntity,
    SQLiteCommentEntity,
    SQLiteNotificationEntity,
  ],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  // ─── Clear existing data ────────────────────────────────────────
  await dataSource.getRepository(SQLiteCommentEntity).clear();
  await dataSource.getRepository(SQLiteNotificationEntity).clear();
  await dataSource.getRepository(SQLitePostEntity).clear();
  await dataSource.getRepository(SQLiteTagEntity).clear();
  await dataSource.getRepository(SQLiteUserEntity).clear();

  // ─── Users ──────────────────────────────────────────────────────
  const users = [
    { id: uuidv4(), username: 'reader_user', role: 'user', password: 'password' },
    { id: uuidv4(), username: 'writer_user', role: 'writer', password: 'password' },
    { id: uuidv4(), username: 'mod_user', role: 'moderator', password: 'password' },
    { id: uuidv4(), username: 'admin_user', role: 'admin', password: 'password' },
  ] as SQLiteUserEntity[];

  await dataSource.getRepository(SQLiteUserEntity).save(users);
  const [reader, writer, _mod, _admin] = users;
  console.log('Users seeded');

  // ─── Tags ────────────────────────────────────────────────────────
  const tags = [
    { id: uuidv4(), name: 'technology', createdAt: new Date() },
    { id: uuidv4(), name: 'science', createdAt: new Date() },
    { id: uuidv4(), name: 'coding', createdAt: new Date() },
    { id: uuidv4(), name: 'nestjs', createdAt: new Date() },
  ] as SQLiteTagEntity[];

  await dataSource.getRepository(SQLiteTagEntity).save(tags);
  console.log('Tags seeded');

  // ─── Posts ───────────────────────────────────────────────────────
  const postRepo = dataSource.getRepository(SQLitePostEntity);

  const accepted = await postRepo.save({
    id: uuidv4(),
    title: 'Getting Started with NestJS',
    content: 'NestJS is a progressive Node.js framework for building efficient server-side applications.',
    status: 'accepted',
    authorId: writer.id,
    slug: 'getting-started-with-nestjs',
    tags: [tags[2], tags[3]],
  });

  await postRepo.save([
    {
      id: uuidv4(),
      title: 'Draft Post',
      content: 'This post is still a draft.',
      status: 'draft',
      authorId: writer.id,
      slug: 'draft-post',
      tags: [],
    },
    {
      id: uuidv4(),
      title: 'Pending Review Post',
      content: 'This post is awaiting review.',
      status: 'waiting',
      authorId: writer.id,
      slug: 'pending-review-post',
      tags: [tags[0]],
    },
    {
      id: uuidv4(),
      title: 'Rejected Post',
      content: 'Unfortunately this post was rejected.',
      status: 'rejected',
      authorId: writer.id,
      slug: 'rejected-post',
      tags: [],
    },
  ]);
  console.log('Posts seeded');

  // ─── Comment ─────────────────────────────────────────────────────
  await dataSource.getRepository(SQLiteCommentEntity).save({
    id: uuidv4(),
    content: 'Great introduction to NestJS!',
    postId: accepted.id,
    authorId: reader.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('Comments seeded');

  await dataSource.destroy();
  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
