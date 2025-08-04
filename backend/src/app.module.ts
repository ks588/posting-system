import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './components/post/post.module';


@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [PostModule],
})
export class AppModule {}
