import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class StripeService {
  public readonly stripe: Stripe;
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(StripeService.name);

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not set in environment variables');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    });
  }

  // Checkout session
  async createCheckoutSession(userId: number, planId: number) {
    const user = await this.prisma.user.findUnique({ where: { UserId: userId } });
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });

    if (!user || !plan) throw new Error('User or Plan not found');
    if (!user.CustomerId) throw new Error('User does not have a Stripe customer ID');

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: user.CustomerId,
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      subscription_data: {
        metadata: {
          userId: user.UserId.toString(), //Added this
        },
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/failed`,
    });

    return session;
  }

      /**
   * Create a Stripe customer for a user
   * @param userId - internal DB user id
   * @param email - user email
   * @param name - optional full name
   * @returns Stripe customer ID
   */
  async createCustomer(userId: number, email: string, name?: string): Promise<string> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: { userId: userId.toString() },
      });

      this.logger.log(`Stripe customer created for user ${userId}: ${customer.id}`);
      return customer.id;
    } catch (err) {
      this.logger.error(`Failed to create Stripe customer for user ${userId}`, err);
      throw err;
    }
  }

  // Webhook handler
  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;

      const userIdStr = subscription.metadata?.userId;
      if (!userIdStr) {
        this.logger.error(`No userId in subscription metadata for subscription ${subscription.id}`, subscription);
        return; // skip processing
      }

      const userId = Number(userIdStr);
      const planId = await this.getPlanIdFromPrice(subscription.items.data[0].price.id);

      const periodEnd = (subscription as any).current_period_end ?? subscription.start_date ?? Math.floor(Date.now() / 1000);

      await this.prisma.userSubscription.create({
        data: {
          userId,
          planId,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          startedAt: new Date(((subscription as any).start_date ?? periodEnd) * 1000),
          expiresAt: new Date(periodEnd * 1000),
          postsUsed: 0,
        },
      });

      this.logger.log(`Subscription ${subscription.id} created for user ${userId}`);
      break;

      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        // Extract userId from metadata
        const userIdStr = subscription.metadata?.userId;
        if (!userIdStr) {
          this.logger.error(`No userId in subscription metadata for subscription ${subscription.id}`);
          break;
        }
        const userId = Number(userIdStr);

        // Map the Stripe price to your plan
        const planId = await this.getPlanIdFromPrice(subscription.items.data[0].price.id);

        // Calculate subscription dates
        const periodStart = (subscription as any).current_period_start ?? subscription.start_date ?? Math.floor(Date.now() / 1000);
        const periodEnd = (subscription as any).current_period_end ?? periodStart + 30 * 24 * 3600; // fallback 30 days

        // Log all relevant subscription details
        this.logger.log(`--- Subscription Updated ---`);
        this.logger.log(`Stripe Subscription ID: ${subscription.id}`);
        this.logger.log(`User ID: ${userId}`);
        this.logger.log(`Plan ID: ${planId}`);
        this.logger.log(`Status: ${subscription.status}`);
        this.logger.log(`Cancel at period end: ${subscription.cancel_at_period_end}`);
        this.logger.log(`Canceled at: ${subscription.canceled_at}`);
        this.logger.log(`Current period start: ${new Date(periodStart * 1000).toISOString()}`);
        this.logger.log(`Current period end: ${new Date(periodEnd * 1000).toISOString()}`);
        this.logger.log(`Quantity: ${subscription.items.data[0].quantity}`);
        this.logger.log(`Price ID: ${subscription.items.data[0].price.id}`);
        this.logger.log(`Price nickname: ${subscription.items.data[0].price.nickname}`);
        this.logger.log(`Billing cycle anchor: ${subscription.billing_cycle_anchor}`);
        this.logger.log(`Metadata: ${JSON.stringify(subscription.metadata)}`);
        this.logger.log(`Trial start: ${subscription.trial_start}`);
        this.logger.log(`Trial end: ${subscription.trial_end}`);
        this.logger.log(`Cancelation details: ${JSON.stringify(subscription.cancellation_details)}`);
        this.logger.log(`---------------------------`);

        // Update subscription record in DB
        try {
          await this.prisma.userSubscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              planId,
              startedAt: new Date(periodStart * 1000),
              expiresAt: new Date(periodEnd * 1000),
              stripeSubscriptionId: subscription.id, // in case it changes
            },
          });
          this.logger.log(`Subscription ${subscription.id} updated for user ${userId}`);
        } catch (err) {
          this.logger.error(`Failed to update subscription ${subscription.id} for user ${userId}: ${err.message}`);
        }

        break;
      }


      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async getPlanIdFromPrice(stripePriceId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { stripePriceId } });
    if (!plan) throw new Error(`Plan not found for Stripe price ID: ${stripePriceId}`);
    return plan.id;
  }
}
