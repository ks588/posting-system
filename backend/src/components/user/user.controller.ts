import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { Roles } from '../../common/auth/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ------------------- PUBLIC ROUTES -------------------
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // ------------------- PROTECTED ROUTES -------------------
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @Req() req) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException('User not found');

    if (req.user.roles !== 'admin' && user.UserId !== req.user.userId) {
      throw new ForbiddenException('Access denied');
    }

    return user;
  }

  @Post('email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findByEmail(@Body('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  async update(
    @Param('id') UserId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    const user = await this.userService.findOne(+UserId);
    if (!user) throw new NotFoundException('User not found');

    if (req.user.roles !== 'admin' && user.UserId !== req.user.userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.userService.update(+UserId, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException('User not found');

    return this.userService.remove(+id);
  }
}
