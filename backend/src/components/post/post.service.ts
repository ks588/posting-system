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
    cloudinary.config({
      cloud_name: 'dks7sqgjd',
      api_key: '763492499273285',
      api_secret: '2rCwCWPwj8Ktj0i2xGyJJL3JfhQ',
    });
  }

  // ----------------- CREATE POST -----------------
  async create(createPostDto: CreatePostDto, file?: Express.Multer.File) {
    // 1. Get user's active subscription
    const userSubscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId: createPostDto.userId,
        expiresAt: { gt: new Date() }, // must be still valid
      },
      select: { planId: true, startedAt: true, expiresAt: true },
    });

    if (!userSubscription) {
      throw new Error('No active subscription found for this user.');
    }

    // 2. Get plan details
    const plan = await this.prisma.plan.findUnique({
      where: { id: userSubscription.planId },
      select: { maxPosts: true },
    });

    if (!plan || plan.maxPosts === null) {
      throw new Error('Plan not found or maxPosts not set.');
    }

    // 3. Count posts within current subscription period
    const postCount = await this.prisma.post.count({
      where: {
        userId: createPostDto.userId,
        createdAt: {
          gte: userSubscription.startedAt,
          lte: userSubscription.expiresAt,
        },
      },
    });


    if (postCount >= plan.maxPosts) {
      throw new Error('You have reached the maximum number of posts allowed for your plan.');
    }

    //Find subscription by userId
    const subscription = await this.prisma.userSubscription.findFirst({
      where: { userId: createPostDto.userId },
      select: { id: true }, // or stripeSubscriptionId if you prefer
    });

    if (!subscription) {
      throw new Error(`No subscription found for user ${createPostDto.userId}`);
    }

    //Update using the unique ID
    await this.prisma.userSubscription.update({
      where: { id: subscription.id }, 
      data: {
        postsUsed: postCount + 1,
      },
    });
    // 4. Upload image to Cloudinary if file exists
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

    // 5. Save post in Prisma
    const post = await this.prisma.post.create({ data: createPostDto });

    // 6. Index in Typesense
    const typesenseDoc = this.typesenseService.prismaPostToTypesenseDoc(post);
    await this.typesenseService.addDocument(typesenseDoc);

    return post;
  }

  // ----------------- SEARCH POSTS -----------------
  async searchPosts(query: string) {
    return this.typesenseService.searchPosts(query);
  }

  // ----------------- FIND ALL POSTS -----------------
  async findAll() {
    const posts = await this.prisma.post.findMany({
      select: { id: true, userId: true, title: true, description: true, imageUrl: true, updatedAt: true },
    });

    const results = await Promise.all(
      posts.map(async (post) => {
        const user = await this.prisma.user.findUnique({
          where: { UserId: post.userId },
          select: { username: true },
        });
        return { ...post, username: user?.username || 'Unknown' };
      }),
    );

    return results;
  }

  // ----------------- FIND ONE POST -----------------
  async findOne(id: number) {
    return await this.prisma.post.findUnique({ where: { id } });
  }

  // ----------------- FIND USER POSTS -----------------
  async findUserPost(userId: number) {
    return await this.prisma.post.findMany({ where: { userId } });
  }

  // ----------------- UPDATE POST -----------------
  async update(id: number, updatePostDto: UpdatePostDto, file?: Express.Multer.File) {
    const existingPost = await this.prisma.post.findUnique({ where: { id } });
    if (!existingPost) throw new Error('Post not found');

    // Check subscription limits again (updates also count as "post usage")
    const userSubscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId: existingPost.userId,
        expiresAt: { gt: new Date() },
      },
      select: { planId: true, startedAt: true, expiresAt: true },
    });

    if (!userSubscription) {
      throw new Error('No active subscription found for this user.');
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: userSubscription.planId },
      select: { maxPosts: true },
    });

    const postCount = await this.prisma.post.count({
      where: {
        userId: existingPost.userId,
        updatedAt: {
          gte: userSubscription.startedAt,
          lte: userSubscription.expiresAt,
        },
      },
    });

    if (!plan || plan.maxPosts === null) {
      throw new Error('Plan not found or maxPosts not set.');
    }

    if (plan?.maxPosts !== null && postCount >= plan.maxPosts) {
      throw new Error('You have reached the maximum number of updates/posts allowed for your plan.');
    }

    let imageUrl = existingPost.imageUrl;

    if (file) {
      if (existingPost.imageUrl) {
        try {
          const publicId = existingPost.imageUrl.split('/').slice(-1)[0].split('.')[0];
          await cloudinary.uploader.destroy(`posts/${publicId}`);
        } catch (err) {
          console.warn('Failed to delete old image from Cloudinary:', err);
        }
      }
      // Upload new image to Cloudinary
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

    const post = await this.prisma.post.update({
      where: { id },
      data: { ...updatePostDto, imageUrl },
    });

    const typesenseDoc = this.typesenseService.prismaPostToTypesenseDoc(post);
    await this.typesenseService.addDocument(typesenseDoc);

    return post;
  }

  // ----------------- DELETE POST -----------------
  async remove(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error('Post not found');

    if (post.imageUrl) {
      const publicId = post.imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) await cloudinary.uploader.destroy(`posts/${publicId}`);
    }

    const deletedPost = await this.prisma.post.delete({ where: { id } });
    await this.typesenseService.deleteDocument(id.toString());

    return deletedPost;
  }
}
