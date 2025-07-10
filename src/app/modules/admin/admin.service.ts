import { Order } from '../order/order.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Types } from 'mongoose';

type DateRange = {
  startDate?: Date;
  endDate?: Date;
};

const defaultStartDate = new Date('2000-01-01T00:00:00Z');
const defaultEndDate = new Date();

const getAdminStatistics = async (dateRange: DateRange = {}) => {
  const startDate = dateRange.startDate || defaultStartDate;
  const endDate = dateRange.endDate || defaultEndDate;

  // Total users count (customers only)
  const totalUsersPromise = User.countDocuments({ role: 'customer' });

  // Total orders count (all)
  const totalOrdersPromise = Order.countDocuments();

  // Total revenue (finalAmount sum) for non-cancelled orders in date range
  const totalRevenuePromise = Order.aggregate([
    {
      $match: {
        status: { $ne: 'cancelled' },
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$finalAmount' },
      },
    },
  ]);

  // Orders count in date range (excluding cancelled)
  const ordersCountInRangePromise = Order.countDocuments({
    status: { $ne: 'cancelled' },
    createdAt: { $gte: startDate, $lte: endDate },
  });

  // Weekly revenue grouping (last 12 weeks or in date range)
  const weeklyRevenuePromise = Order.aggregate([
    {
      $match: {
        status: { $ne: 'cancelled' },
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          week: { $isoWeek: '$createdAt' },
        },
        revenue: { $sum: '$finalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } },
  ]);

  // Monthly revenue grouping (last 12 months or in date range)
  const monthlyRevenuePromise = Order.aggregate([
    {
      $match: {
        status: { $ne: 'cancelled' },
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$finalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Top 5 products sold (by total quantity ordered)
  const topProductsPromise = Order.aggregate([
    { $unwind: '$orderedProducts' },
    {
      $group: {
        _id: '$orderedProducts.product',
        totalQuantity: { $sum: '$orderedProducts.quantity' },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        name: '$productDetails.name',
        price: '$productDetails.price',
      },
    },
  ]);

  // Revenue breakdown by category
  const revenueByCategoryPromise = Order.aggregate([
    { $unwind: '$orderedProducts' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderedProducts.product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $lookup: {
        from: 'categories',
        localField: 'productDetails.category',
        foreignField: '_id',
        as: 'categoryDetails',
      },
    },
    { $unwind: '$categoryDetails' },
    {
      $group: {
        _id: '$categoryDetails.name',
        revenue: { $sum: '$orderedProducts.unitPrice' },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  // Revenue breakdown by brand
  const revenueByBrandPromise = Order.aggregate([
    { $unwind: '$orderedProducts' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderedProducts.product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $lookup: {
        from: 'brands',
        localField: 'productDetails.brand',
        foreignField: '_id',
        as: 'brandDetails',
      },
    },
    { $unwind: '$brandDetails' },
    {
      $group: {
        _id: '$brandDetails.name',
        revenue: { $sum: '$orderedProducts.unitPrice' },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  // Cancelled orders count in date range
  const cancelledOrdersCountPromise = Order.countDocuments({
    status: 'cancelled',
    createdAt: { $gte: startDate, $lte: endDate },
  });


  // New users per month (last 12 months or in date range)
  const newUsersPerMonthPromise = User.aggregate([
    {
      $match: {
        role: 'customer',
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Low stock alerts (products with stock below threshold)
  const lowStockThreshold:number = 10; // configurable threshold
  const lowStockProductsPromise = Product.find({
    stock: { $lte: lowStockThreshold },
  }).select('name stock');

  // Await all promises concurrently
  const [
    totalUsers,
    totalOrders,
    totalRevenueAgg,
    ordersCountInRange,
    weeklyRevenue,
    monthlyRevenue,
    topProducts,
    revenueByCategory,
    revenueByBrand,
    cancelledOrdersCount,
    newUsersPerMonth,
    lowStockProducts,
  ] = await Promise.all([
    totalUsersPromise,
    totalOrdersPromise,
    totalRevenuePromise,
    ordersCountInRangePromise,
    weeklyRevenuePromise,
    monthlyRevenuePromise,
    topProductsPromise,
    revenueByCategoryPromise,
    revenueByBrandPromise,
    cancelledOrdersCountPromise,
    newUsersPerMonthPromise,
    lowStockProductsPromise,
  ]);

  const totalRevenue = totalRevenueAgg.length ? totalRevenueAgg[0].totalRevenue : 0;

  return {
    totalUsers,
    totalOrders,
    totalRevenue,
    ordersCountInRange,
    weeklyRevenue,
    monthlyRevenue,
    topProducts,
    revenueByCategory,
    revenueByBrand,
    cancelledOrdersCount,
    newUsersPerMonth,
    lowStockProducts,
  };
};

export const adminServices={getAdminStatistics}
