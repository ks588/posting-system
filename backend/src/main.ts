import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  dotenv.config(); // Load environment variables

  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors({
    origin: 'http://localhost:4000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Parse raw body for Stripe webhook only
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  // Parse JSON normally for all routes
  app.use(bodyParser.json());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
