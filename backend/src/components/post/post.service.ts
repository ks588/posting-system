import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {} // Inject PrismaService
  //create
  async create(createPostDto: CreatePostDto) {
    return await this.prisma.post.create({
      data: createPostDto,
    });
  }
  //find all
    async findAll() {
    return await this.prisma.post.findMany();
    }
  //find one
  async findOne(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
    });
  }
  //update
  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }
  //remove
  async remove(id: number) {
    return await this.prisma.post.delete({
      where: { id },
    });
  }
}
