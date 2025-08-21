import { ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, username, role } = createUserDto;

      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          role
        },
      });
      const payload = {
        UserId: user.UserId,
        email: user.email,
        username: user.username,
        role: user.role
      };
      return payload;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll() {
    try {
      const allUser = await this.prisma.user.findMany({
        select: {
          UserId: true,
          email: true,
          username: true,
          role: true,
        },
      });

      if (!allUser || allUser.length === 0) {
        throw new NotFoundException('There are no users yet.');
      }

      return allUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async update(UserId: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { UserId },
        data: updateUserDto,
        select: {
          UserId: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with ID ${UserId} not found`);
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(UserId: number) {
    try {
      await this.prisma.user.delete({ where: { UserId } });
      return { message: `User with ID ${UserId} removed successfully` };
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with ID ${UserId} not found`);
      }
      throw new InternalServerErrorException('Failed to remove user');
    }
  }

  async findOne(UserId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { UserId },
        select: {
          UserId: true,
          email: true,
          username: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          UserId: true,
          email: true,
          username: true,
          createdAt: true,
          password: true,
          role:true
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }
}
