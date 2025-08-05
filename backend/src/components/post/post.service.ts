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

    // Index to Typesense
    await this.typesenseService.addDocument({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl ?? undefined,
    });

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

  // Update post and Typesense document
  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });

    // Update Typesense document
    await this.typesenseService.addDocument({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl ?? undefined,
    });

    return post;
  }

  // Delete post and remove from Typesense
  async remove(id: number) {
    const deletedPost = await this.prisma.post.delete({
      where: { id },
    });

    // Remove from Typesense
    await this.typesenseService.deleteDocument(id);

    return deletedPost;
  }

}
