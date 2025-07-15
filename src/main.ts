// FAJL: src/main.ts (PREPORUČENA IZMENA)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Uvezi ValidationPipe
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 👇 DODAJ OVU LINIJU
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatski uklanja polja koja nisu definisana u DTO
      forbidNonWhitelisted: true, // Baca grešku ako postoje polja koja nisu u DTO
      transform: true, // Automatski transformiše payload u DTO instance
      transformOptions: {
        enableImplicitConversion: true,
      }
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
