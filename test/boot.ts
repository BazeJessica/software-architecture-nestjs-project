import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.init();
    console.log('App initialized successfully');
    await app.close();
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
}

bootstrap();
