import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './modules/posts/post.module';
import { AuthModule } from './modules/shared/auth/auth.module';
import { DatabaseModule } from './modules/shared/database/database.module';
import { UserModule } from './modules/users/user.module';
import { CommentModule } from './modules/comments/comment.module';
import { NotificationModule } from './modules/notifications/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
      }),
    }),
    AuthModule,
    DatabaseModule,
    EventEmitterModule.forRoot(),
    PostModule,
    UserModule,
    CommentModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
