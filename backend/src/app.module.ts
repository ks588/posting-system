import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './components/post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { TypesenseModule } from './common/typesense/typesense.module';
import { UserModule } from './components/user/user.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    PostModule,
    PrismaModule,
    TypesenseModule,
    UserModule
  ] //Imports
})
export class AppModule {}
