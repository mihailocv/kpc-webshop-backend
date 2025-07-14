import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Change in production to allow specific origins
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
