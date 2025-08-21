import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
  Req,
  NotFoundException,
  UseInterceptors, 
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { Roles } from '../../common/auth/decorators/roles.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // --------------------- PUBLIC ROUTES ---------------------
  @Get('search')
  search(@Query('q') query: string) {
    return this.postService.searchPosts(query);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  @Get('user/:userId')
  async findUserPost(@Param('userId') userId: string) {
    const posts = await this.postService.findUserPost(+userId);
    return posts;
  }

  // --------------------- PROTECTED ROUTES ---------------------
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @UseInterceptors(FileInterceptor('image')) // 'image' = field name in FormData
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File, // receives uploaded file
    @Req() req
  ) {
    createPostDto.userId = req.user.userId;
    return this.postService.create(createPostDto, file);
  }

  // --------------------- PROTECTED - USER SPECIFIC ROUTES ---------
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @UseInterceptors(FileInterceptor('image')) // 'image' = field name in FormData
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File, // receives uploaded file
    @Req() req,
  ) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException('Post not found');

    // Only allow if admin OR owner
    if (req.user.roles !== 'admin' && post.userId !== req.user.userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.postService.update(+id, updatePostDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  async remove(@Param('id') id: string, @Req() req) {
    const post = await this.postService.findOne(+id);
    if (!post) throw new NotFoundException('Post not found');

    // Only allow if admin OR owner
    if (req.user.roles !== 'admin' && post.userId !== req.user.userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.postService.remove(+id);
  }
}
