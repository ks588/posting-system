import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './components/post/post.module';
import { PrismaService } from './prisma/prisma.service';


@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  imports: [PostModule],
  exports: [PrismaService]       
})
export class AppModule {}
