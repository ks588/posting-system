import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); //load env variables
  
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor()); //responce interceptor

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
