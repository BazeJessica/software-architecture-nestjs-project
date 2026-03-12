import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

describe('Features E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let userId: string;
  let postId: string;
  let tagId: string;

  beforeAll(async () => {
    console.log('ENV DATABASE_URL:', process.env.DATABASE_URL);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);
    const configService = app.get(ConfigService);
    console.log('E2E DATABASE_URL:', configService.get('DATABASE_URL'));
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });

  it('1. Register and Login', async () => {
    const username = `user_${Date.now()}`;
    await request(app.getHttpServer())
      .post('/users')
      .send({ username, password: 'password123', role: 'writer' })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password: 'password123' })
      .expect(201);

    authToken = loginRes.body.access_token;
    userId = loginRes.body.user.id;
    expect(authToken).toBeDefined();
  });

  it('2. Create Post and verify slug', async () => {
    const res = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'My Awesome Post', content: 'Some content here' })
      .expect(201);

    postId = res.body.id;
    expect(res.body.slug).toBe('my-awesome-post');
  });

  it('3. Create Tag and add to Post', async () => {
    // There is no dedicated Tag Controller yet in the provided code, but I added TagEntity.
    // Wait, let's check if I added Tag controller.
    // I added AddTagToPost to PostController.
    // I should create a tag manually in the DB or via Tag endpoint if it exists.

    // Let's check Tag endpoints.
    // Earlier I saw TagRepository and GetTagsUseCase.

    // For test simplicity, let's just insert a tag into the DB.
    const tag = await dataSource.query(
      `INSERT INTO tags (id, name) VALUES ('tag-1', 'nestjs') RETURNING id`,
    );
    tagId = 'tag-1';

    await request(app.getHttpServer())
      .post(`/posts/${postId}/tags/${tagId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    const postRes = await request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(postRes.body.tags).toContainEqual(
      expect.objectContaining({ name: 'nestjs' }),
    );
  });

  it('4. Comment on Post (after approving it)', async () => {
    // Must be accepted to comment
    await request(app.getHttpServer())
      .patch(`/posts/${postId}/approve`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const commentRes = await request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'Nice post!' })
      .expect(201);

    expect(commentRes.body.content).toBe('Nice post!');
  });

  it('5. Verify Notifications', async () => {
    const res = await request(app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Should have notification for post approval and potentially the comment
    expect(res.body.notifications.length).toBeGreaterThan(0);
  });
});
