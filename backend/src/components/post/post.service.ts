import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { TypesenseService } from 'src/common/typesense/typesense.service';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly typesenseService: TypesenseService,
  ) {
    // Direct hardcoded Cloudinary config in constructor
    cloudinary.config({
      cloud_name: 'dks7sqgjd',
      api_key: '763492499273285',
      api_secret: '2rCwCWPwj8Ktj0i2xGyJJL3JfhQ',
    });
  }

  // ----------------- CREATE POST -----------------
  async create(createPostDto: CreatePostDto, file?: Express.Multer.File) {
    let imageUrl = createPostDto.imageUrl || ''; // fallback if no image

    // Upload image to Cloudinary if file exists
    if (file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'posts' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(file.buffer);
      });

      createPostDto.imageUrl = result.secure_url;
    }

    // Save post in Prisma
    const post = await this.prisma.post.create({
      data: createPostDto,
    });

    // Index in Typesense
    const typesenseDoc = this.typesenseService.prismaPostToTypesenseDoc(post);
    await this.typesenseService.addDocument(typesenseDoc);

    return post;
  }

  // Search posts from Typesense
  async searchPosts(query: string) {
    return this.typesenseService.searchPosts(query);
  }

async findAll() {
  const posts = await this.prisma.post.findMany({
    select: { id: true, userId: true, title: true, description: true, imageUrl: true, updatedAt: true }
  });

  // Fetch username for each post
  const results = await Promise.all(
    posts.map(async (post) => {
      const user = await this.prisma.user.findUnique({
        where: { UserId: post.userId },
        select: { username: true },
      });
      return { ...post, username: user?.username || 'Unknown' };
    })
  );

  return results;
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

  // Update post and Typesense document, with optional image replacement
  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    file?: Express.Multer.File, // make file optional
  ) {
    // Fetch existing post
    const existingPost = await this.prisma.post.findUnique({ where: { id } });
    if (!existingPost) throw new Error('Post not found');

    let imageUrl = existingPost.imageUrl;

    // If a new file is uploaded, replace the existing image
    if (file) {
      // Delete the old image from Cloudinary if it exists
      if (existingPost.imageUrl) {
        try {
          // Extract public_id from the URL
          const publicId = existingPost.imageUrl
            .split('/')
            .slice(-1)[0]
            .split('.')[0];
          await cloudinary.uploader.destroy(`posts/${publicId}`);
        } catch (err) {
          console.warn('Failed to delete old image from Cloudinary:', err);
        }
      }

      // Upload the new file to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'posts' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(file.buffer);
      });

      imageUrl = result.secure_url;
    }

    // Update post in Prisma with new data and image URL
    const post = await this.prisma.post.update({
      where: { id },
      data: { ...updatePostDto, imageUrl },
    });

    // Update Typesense index
    const typesenseDoc = this.typesenseService.prismaPostToTypesenseDoc(post);
    await this.typesenseService.addDocument(typesenseDoc);

    return post;
  }


    // Delete post, remove image from Cloudinary, and remove from Typesense
  async remove(id: number) {
    // Find the post first
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error('Post not found');

    // Delete image from Cloudinary if it exists
    if (post.imageUrl) {
      // Extract the public ID from the URL
      const publicId = post.imageUrl
        .split('/')
        .pop()          // get filename
        ?.split('.')[0]; // remove extension

      if (publicId) {
        await cloudinary.uploader.destroy(`posts/${publicId}`);
      }
    }

    // Delete post from Prisma
    const deletedPost = await this.prisma.post.delete({ where: { id } });

    // Remove from Typesense
    await this.typesenseService.deleteDocument(id.toString());

    return deletedPost;
  }
}
