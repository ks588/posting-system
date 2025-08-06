import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { TypesenseService } from 'src/common/typesense/typesense.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly typesenseService: TypesenseService,
  ) {}

  // Create post and index to Typesense
  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: createPostDto,
    });

    // Convert Prisma post to Typesense format and index
    const typesenseDoc = this.typesenseService.prismaPostToTypesenseDoc(post);
    await this.typesenseService.addDocument(typesenseDoc);

    return post;
  }

  // Search posts from Typesense
  async searchPosts(query: string) {
    return this.typesenseService.searchPosts(query);
  }

  // Find all posts
  async findAll() {
    return await this.prisma.post.findMany();
  }

  // Find one post
  async findOne(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
    });
  }

  // Find user post 
  async findUserPost(userId: number) {
    const post = await this.prisma.post.findMany({where:{userId}});
    return post;
  }

  // Update post and Typesense document
  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });

    // Convert and update Typesense document
    const typesenseDoc = this.typesenseService.prismaPostToTypesenseDoc(post);
    await this.typesenseService.addDocument(typesenseDoc);

    return post;
  }

  // Delete post and remove from Typesense
  async remove(id: number) {
    const deletedPost = await this.prisma.post.delete({
      where: { id },
    });

    // Remove from Typesense (id as string)
    await this.typesenseService.deleteDocument(id.toString());

    return deletedPost;
  }
}
