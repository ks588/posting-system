import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypesenseModule } from 'src/common/typesense/typesense.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypesenseModule], // Import TypesenseModule for search functionality
})
export class PostModule {}
