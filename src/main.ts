// FAJL: src/main.ts (PREPORUČENA IZMENA)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Uvezi ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 DODAJ OVU LINIJU
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatski uklanja polja koja nisu definisana u DTO
      forbidNonWhitelisted: true, // Baca grešku ako postoje polja koja nisu u DTO
      transform: true, // Automatski transformiše payload u DTO instance
    }),
  );

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
