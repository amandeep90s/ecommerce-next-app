import { StatusCodes } from 'http-status-codes';
import { headers } from 'next/headers';

import { connectToDatabase } from '@/config/database';
import { STRIPE_WEBHOOK_SECRET } from '@/config/env';
import { stripe } from '@/config/stripe';
import { errorResponse, successResponse } from '@/lib/api-response';
import Order from '@/models/order.model';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return errorResponse({
        message: 'Missing Stripe signature',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return errorResponse({
        message: 'Invalid webhook signature',
        errors: err,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    await connectToDatabase();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'paid',
            status: 'processing',
            stripePaymentIntentId: session.payment_intent as string,
          });
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'failed',
            status: 'cancelled',
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        // Find order by payment intent and mark as failed
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          {
            paymentStatus: 'failed',
            status: 'cancelled',
          },
        );
        break;
      }

      default:
        break;
    }

    return successResponse({
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    return errorResponse({
      message: 'Webhook processing failed',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
