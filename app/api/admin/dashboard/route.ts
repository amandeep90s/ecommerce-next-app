import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { EOrderStatus, EPaymentStatus, ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Order from '@/models/order.model';
import Product from '@/models/product.model';
import Review from '@/models/review.model';
import User from '@/models/user.model';

export async function GET() {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // --- Stats Cards ---
    const [
      totalUsers,
      usersLastMonth,
      usersThisMonth,
      totalOrders,
      ordersLastMonth,
      ordersThisMonth,
      revenueThisMonth,
      revenueLastMonth,
    ] = await Promise.all([
      User.countDocuments({ role: ERole.USER } as Record<string, unknown>),
      User.countDocuments({
        role: ERole.USER,
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      } as Record<string, unknown>),
      User.countDocuments({
        role: ERole.USER,
        createdAt: { $gte: startOfCurrentMonth },
      } as Record<string, unknown>),
      Order.countDocuments(),
      Order.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      } as Record<string, unknown>),
      Order.countDocuments({
        createdAt: { $gte: startOfCurrentMonth },
      } as Record<string, unknown>),
      Order.aggregate([
        {
          $match: {
            paymentStatus: EPaymentStatus.PAID,
            createdAt: { $gte: startOfCurrentMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: EPaymentStatus.PAID,
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const currentRevenue = revenueThisMonth[0]?.total || 0;
    const previousRevenue = revenueLastMonth[0]?.total || 0;
    const revenueChange = previousRevenue
      ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
      : '0';

    const ordersChange = ordersLastMonth
      ? (((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(1)
      : '0';

    const usersChange = usersLastMonth
      ? (((usersThisMonth - usersLastMonth) / usersLastMonth) * 100).toFixed(1)
      : '0';

    const userGrowthCurrent = totalUsers ? ((usersThisMonth / totalUsers) * 100).toFixed(1) : '0';
    const userGrowthPrevious = totalUsers ? ((usersLastMonth / totalUsers) * 100).toFixed(1) : '0';
    const userGrowthChange = (
      parseFloat(userGrowthCurrent) - parseFloat(userGrowthPrevious)
    ).toFixed(1);

    // --- Recent Orders ---
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(8).lean();

    // --- Best Selling Products (by total quantity sold) ---
    const bestSelling = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          name: { $first: '$products.name' },
          image: { $first: '$products.image' },
          price: { $first: '$products.selling_price' },
          sold: { $sum: '$products.quantity' },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 8 },
    ]);

    // --- Customer Reviews Distribution ---
    const reviewStats = await Review.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    const ratings = [5, 4, 3, 2, 1].map((star) => ({
      stars: star,
      count: reviewStats.find((r) => r._id === star)?.count || 0,
    }));

    // --- Revenue Chart (last 6 months) ---
    const revenueByMonth = await Order.aggregate([
      {
        $match: {
          paymentStatus: EPaymentStatus.PAID,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const revenueChartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = revenueByMonth.find((r) => r._id.year === year && r._id.month === month);
      revenueChartData.push({
        month: monthNames[month - 1],
        revenue: found?.total || 0,
        orders: found?.count || 0,
      });
    }

    // --- Orders by Status (for returning rate / bar chart) ---
    const ordersByMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: 1 },
          delivered: {
            $sum: { $cond: [{ $eq: ['$status', EOrderStatus.DELIVERED] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const ordersTrendData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = ordersByMonth.find((r) => r._id.year === year && r._id.month === month);
      ordersTrendData.push({
        month: monthNames[month - 1],
        total: found?.total || 0,
        delivered: found?.delivered || 0,
      });
    }

    // --- Sales by Location (top states from shipping addresses) ---
    const salesByLocation = await Order.aggregate([
      { $match: { paymentStatus: EPaymentStatus.PAID } },
      {
        $group: {
          _id: '$shippingAddress.state',
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 6 },
    ]);

    const totalSales = salesByLocation.reduce((acc, loc) => acc + loc.total, 0);
    const locationData = salesByLocation.map((loc) => ({
      location: loc._id || 'Unknown',
      total: loc.total,
      percentage: totalSales ? Math.round((loc.total / totalSales) * 100) : 0,
    }));

    // --- Welcome Banner ---
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: EPaymentStatus.PAID } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // --- Total Products ---
    const totalProducts = await Product.countDocuments({ deletedAt: null });

    return successResponse({
      message: 'Dashboard data fetched successfully',
      data: {
        stats: {
          revenue: {
            value: currentRevenue,
            change: revenueChange,
            trend: parseFloat(revenueChange) >= 0 ? 'up' : 'down',
          },
          users: {
            value: totalUsers,
            change: usersChange,
            trend: parseFloat(usersChange) >= 0 ? 'up' : 'down',
          },
          orders: {
            value: totalOrders,
            change: ordersChange,
            trend: parseFloat(ordersChange) >= 0 ? 'up' : 'down',
          },
          userGrowth: {
            value: userGrowthCurrent,
            change: userGrowthChange,
            trend: parseFloat(userGrowthChange) >= 0 ? 'up' : 'down',
          },
        },
        recentOrders: recentOrders.map((order) => ({
          id: order.orderNumber,
          customer: order.customerSnapshot?.name || 'N/A',
          product: order.products?.[0]?.name || 'N/A',
          amount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
        })),
        bestSelling: bestSelling.map((p) => ({
          name: p.name,
          image: p.image || '/products/placeholder.svg',
          price: p.price,
          sold: p.sold,
        })),
        ratings,
        revenueChart: revenueChartData,
        ordersTrend: ordersTrendData,
        salesByLocation: locationData,
        welcomeBanner: {
          totalRevenue: totalRevenue[0]?.total || 0,
          revenueChange: revenueChange,
          totalProducts,
        },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch dashboard data',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
