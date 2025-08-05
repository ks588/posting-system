import { Injectable, OnModuleInit } from '@nestjs/common';
import Typesense, { Client } from 'typesense';

interface PostDocument {
  id: string;          //string type for Typesense
  userId: string;       
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;    
}

@Injectable()
export class TypesenseService implements OnModuleInit {
  private client: Client;

  async onModuleInit() {
    this.client = new Typesense.Client({
      nodes: [
        {
          host: process.env.TYPESENSE_HOST ?? 'localhost',
          port: Number(process.env.TYPESENSE_PORT) ?? 8108,
          protocol: process.env.TYPESENSE_PROTOCOL ?? 'http',
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY ?? 'xyz123',
      connectionTimeoutSeconds: 2,
    });

    try {
      await this.client.collections('posts').retrieve();
      console.log('Collection "posts" already exists');
    } catch (error: any) {
      if (error.httpStatus === 404 || error.message?.includes('Not Found')) {
        console.log('Collection "posts" not found, creating...');
        await this.createCollection();
      } else {
        console.error('Failed to initialize Typesense:', error);
        throw error;
      }
    }
  }

  async createCollection() {
    return this.client.collections().create({
      name: 'posts',
      fields: [
        { name: 'id', type: 'string' },           
        { name: 'userId', type: 'string' },       
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'imageUrl', type: 'string', optional: true },
        { name: 'createdAt', type: 'int64' },     
      ],
      default_sorting_field: 'createdAt',         
    });
  }

  // Convert Prisma Post to Typesense PostDocument
  prismaPostToTypesenseDoc(post: {
    id: number;
    userId: number;
    title: string;
    description: string;
    imageUrl?: string | null;
    createdAt: Date;
  }): PostDocument {
    return {
      id: post.id.toString(),
      userId: post.userId.toString(),
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl ?? undefined,
      createdAt: Math.floor(post.createdAt.getTime() / 1000).toString(), // Unix timestamp in seconds
    };
  }

  async addDocument(document: PostDocument) {
    try {
      return await this.client.collections('posts').documents().upsert(document);
    } catch (error) {
      console.error('Typesense add document error:', error);
      throw error;
    }
  }

  async searchPosts(query: string) {
    try {
      return await this.client.collections('posts').documents().search({
        q: query,
        query_by: 'title,description',
        highlight_full_fields: 'title,description',
      });
    } catch (error) {
      console.error('Typesense search error:', error);
      throw error;
    }
  }

  async deleteDocument(id: string | number) {
    try {
      return await this.client.collections('posts').documents(String(id)).delete();
    } catch (error) {
      console.error('Typesense delete document error:', error);
      throw error;
    }
  }
}
