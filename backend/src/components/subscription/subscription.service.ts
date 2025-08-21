import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not set in environment variables');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    });
  }

  create(createSubscriptionDto: CreateSubscriptionDto) {
    return 'This action adds a new subscription';
  }

  findAll() {
    return 'This action returns all subscriptions';
  }

  async findOne(userId: number) {
    // Step 1: Get the user's subscription
    const userSubscription = await this.prisma.userSubscription.findFirst({
      where: { userId },
      select: {
        id: true,
        postsUsed: true,
        planId: true,
        startedAt: true,
        expiresAt: true,
      },
    });

    if (!userSubscription) {
      throw new NotFoundException('No subscription found for this user');
    }

    // Step 2: Get the related plan
    const plan = await this.prisma.plan.findUnique({
      where: { id: userSubscription.planId },
      select: { name: true, maxPosts: true },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found for this subscription');
    }

    const remainingPosts = (plan.maxPosts ?? 0) - userSubscription.postsUsed;

    return {
      userSubscription,
      plan,
      remainingPosts,
    };
  }

  // ------------------- Stripe Customer Portal -------------------
  async createCustomerPortalSession(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { UserId: userId },
      select: { CustomerId: true },
    });

    if (!user?.CustomerId) {
      throw new NotFoundException('No Stripe customer found for this user.');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.CustomerId,
      return_url: process.env.STRIPE_RETURN_URL || 'http://localhost:4000/home',
    });

    return { url: session.url };
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }

  async getAllSubscriptions() { //admin allowed view all subscriptions
    const subscriptions = await this.prisma.userSubscription.findMany({
  });
    
    return subscriptions;
}

}
