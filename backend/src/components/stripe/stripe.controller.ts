import { Controller, Post, Body, Req, Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // Checkout route
  @Post('checkout')
  async createCheckout(@Body() body: { userId: number; planId: number }) {
    const session = await this.stripeService.createCheckoutSession(
      body.userId,
      body.planId,
    );
    return {url: session.url};
  }

  // Webhook route
  @Post('webhook')
  async webhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      // Use raw body for verification
      const rawBody = req.body;

      event = this.stripeService.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );

      await this.stripeService.handleWebhook(event);

      res.json({ received: true });
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
