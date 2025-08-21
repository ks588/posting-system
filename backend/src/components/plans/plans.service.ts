import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlanDto) {
    return this.prisma.plan.create({ data });
  }

  async findAll() {
    return this.prisma.plan.findMany();
  }

  async findOne(id: number) {
    return this.prisma.plan.findUnique({ where: { id } });
  }
}
