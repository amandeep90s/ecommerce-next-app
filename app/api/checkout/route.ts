import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${ts}${rand}`;
}

import { APP_BASE_URL } from '@/config/env';
import { stripe } from '@/config/stripe';
import { EOrderStatus, EPaymentMethod, EPaymentStatus } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { createNotification } from '@/lib/create-notification';
import { requireAuth } from '@/lib/require-auth';
import Coupon from '@/models/coupon.model';
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
    const subtotal = products.reduce((sum, item) => sum + item.selling_price * item.quantity, 0);

    // Validate and apply coupon discount
    let discountPercentage = 0;
    let validatedCouponCode: string | undefined;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: {
          $regex: new RegExp(`^${couponCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        },
        deletedAt: null,
        isActive: true,
      });

      if (coupon) {
        const now = new Date();
        if (
          now >= new Date(coupon.validFrom) &&
          now <= new Date(coupon.validTo) &&
          subtotal >= coupon.minimumPurchase
        ) {
          discountPercentage = coupon.discount;
          validatedCouponCode = coupon.code;
        }
      }
    }

    const discountAmount = (subtotal * discountPercentage) / 100;
    const totalAmount = subtotal - discountAmount;

    // Create the order with pending payment status
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: auth.user.id,
      customerSnapshot,
      couponCode: validatedCouponCode,
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

    // If coupon discount applies, create a short-lived Stripe coupon for this
    // session only. We delete it immediately after the session is created so it
    // doesn't accumulate in the Stripe dashboard — the discount is already
    // embedded in the session at that point and deletion has no effect on it.
    let discounts: { coupon: string }[] | undefined;
    let stripeCouponId: string | undefined;
    if (discountPercentage > 0) {
      const stripeCoupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: 'once',
      });
      stripeCouponId = stripeCoupon.id;
      discounts = [{ coupon: stripeCouponId }];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      ...(discounts && { discounts }),
      success_url: `${APP_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_BASE_URL}/checkout/cancel`,
      metadata: {
        orderId: order._id.toString(),
        userId: auth.user.id,
      },
      customer_email: customerSnapshot?.email,
    });

    // Save the Stripe session ID and coupon ID to the order.
    // The Stripe coupon is deleted from Stripe in the webhook after the session
    // completes or expires — deleting it here would invalidate the session discount.
    order.stripeSessionId = session.id;
    if (stripeCouponId) order.stripeCouponId = stripeCouponId;
    await order.save();

    // Non-fatal admin notification
    await createNotification({
      type: 'new_order',
      title: 'New Order Placed',
      message: `Order ${order.orderNumber} — $${totalAmount.toFixed(2)}`,
      referenceId: order._id.toString(),
    });

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
