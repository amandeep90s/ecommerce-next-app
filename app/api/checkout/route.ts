import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { APP_BASE_URL } from '@/config/env';
import { stripe } from '@/config/stripe';
import { EOrderStatus, EPaymentMethod, EPaymentStatus } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Order from '@/models/order.model';
import { ICheckoutRequest } from '@/types';

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const body = (await request.json()) as ICheckoutRequest;
    const { products, shippingAddress, customerSnapshot, couponCode, note } = body;

    if (!products || products.length === 0) {
      return errorResponse({
        message: 'No products provided',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (!shippingAddress) {
      return errorResponse({
        message: 'Shipping address is required',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    // Calculate total from products
    const totalAmount = products.reduce((sum, item) => sum + item.selling_price * item.quantity, 0);

    // Create the order with pending payment status
    const order = await Order.create({
      userId: auth.user.id,
      customerSnapshot,
      couponCode,
      products,
      shippingAddress,
      totalAmount,
      status: EOrderStatus.PENDING,
      paymentMethod: EPaymentMethod.STRIPE,
      paymentStatus: EPaymentStatus.PENDING,
      note,
    });

    // Create Stripe Checkout Session
    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          ...(product.image && { images: [product.image] }),
        },
        unit_amount: Math.round(product.selling_price * 100), // Stripe expects cents
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${APP_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_BASE_URL}/checkout/cancel`,
      metadata: {
        orderId: order._id.toString(),
        userId: auth.user.id,
      },
      customer_email: customerSnapshot?.email,
    });

    // Save the Stripe session ID to the order
    order.stripeSessionId = session.id;
    await order.save();

    return successResponse({
      message: 'Checkout session created successfully',
      data: {
        sessionId: session.id,
        url: session.url,
      },
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to create checkout session',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
