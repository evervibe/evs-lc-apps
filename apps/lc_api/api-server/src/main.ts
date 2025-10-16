import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validateEnvironment } from './config/env.validation';

async function bootstrap() {
  // Validate environment variables before starting
  validateEnvironment();

  console.log('[Bootstrap] Creating Nest application...');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );
  console.log('[Bootstrap] Nest application created');

  // Enable CORS
  console.log('[Bootstrap] Enabling CORS...');
  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  console.log('[Bootstrap] Setting up Swagger...');
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('LC API - Portal + Game Integration')
    .setDescription('Last Chaos Backend API - Portal System (PostgreSQL) + Game Integration (MySQL)')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('tickets', 'Support tickets')
    .addTag('payments', 'Payment processing')
    .addTag('redeem', 'Redeem codes')
    .addTag('news', 'News management')
    .addTag('votes', 'Vote system')
    .addTag('game', 'Game integration')
    .addTag('health', 'Health checks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  console.log(`[Bootstrap] Starting server on port ${port}...`);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 LC API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
