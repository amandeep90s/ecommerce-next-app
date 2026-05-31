import { StatusCodes } from 'http-status-codes';
import { headers } from 'next/headers';

import { connectToDatabase } from '@/config/database';
import { STRIPE_WEBHOOK_SECRET } from '@/config/env';
import { stripe } from '@/config/stripe';
import { EOrderStatus, EPaymentStatus } from '@/enums';
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
          const order = await Order.findByIdAndUpdate(
            orderId,
            {
              paymentStatus: EPaymentStatus.PAID,
              status: EOrderStatus.PROCESSING,
              stripePaymentIntentId: session.payment_intent as string,
            },
            { new: true },
          ).lean<import('@/types').IOrderDocument>();
          // Clean up the ephemeral Stripe coupon now that payment is confirmed.
          if (order?.stripeCouponId) {
            stripe.coupons.del(order.stripeCouponId).catch(() => {
              // Intentionally swallowed — cleanup is best-effort.
            });
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const order = await Order.findByIdAndUpdate(
            orderId,
            {
              paymentStatus: EPaymentStatus.FAILED,
              status: EOrderStatus.CANCELLED,
            },
            { new: true },
          ).lean<import('@/types').IOrderDocument>();
          // Clean up the ephemeral Stripe coupon now that the session is expired.
          if (order?.stripeCouponId) {
            stripe.coupons.del(order.stripeCouponId).catch(() => {
              // Intentionally swallowed — cleanup is best-effort.
            });
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        // Find order by payment intent and mark as failed
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          {
            paymentStatus: EPaymentStatus.FAILED,
            status: EOrderStatus.CANCELLED,
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
