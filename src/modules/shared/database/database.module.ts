import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLitePostEntity } from '../../posts/infrastructure/entities/post.sqlite.entity';
import { SQLiteUserEntity } from '../../users/infrastructure/entities/user.sqlite.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_URL'),
        entities: [SQLitePostEntity, SQLiteUserEntity],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
