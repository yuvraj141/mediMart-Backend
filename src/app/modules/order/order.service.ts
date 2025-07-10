import { Order } from './order.model';
import { TOrder, TOrderStatus } from './order.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';

const createOrderIntoDB = async (payload: TOrder) => {
  for (const item of payload.orderedProducts) {
  const product = await Product.findById(item.product);
  if (!product || product.stock < item.quantity) {
    throw new AppError(httpStatus.NOT_FOUND,`${product?.name || 'Product'} is out of stock`);
  }
}
  const result = await Order.create(payload);
  
  // ✅ Decrement stock for each product
  const bulkOps = result.orderedProducts.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { stock: -item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkOps);

 return result;

};
const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    Order.find()
      .populate('user', 'name email')
      .populate('orderedProducts.product', 'name price'),
    query
  )
    .search(['status', 'paymentStatus', 'paymentMethod', 'contactNumber'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery.lean();
  const meta = await orderQuery.countTotal();

  return { result, meta };
};
//getSingle
const getSingleOrderFromDB = async (orderId: string) => {

  const result = await Order.findById(orderId)
    .populate('user', 'name email')
    .populate('orderedProducts.product', 'name price description') // add fields as needed
    .lean();

 
  return result;
};
//update-status
const updateOrderStatusByAdmin = async (orderId: string, newStatus:TOrderStatus) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Prevent changing status once delivered or cancelled
  if (order.status === 'delivered' || order.status === 'cancelled') {
    throw new AppError(httpStatus.BAD_REQUEST, `Cannot update order as it's already ${order.status}`);
  }

  order.status = newStatus;

  if (newStatus === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid'; // Optional: auto-mark as paid if delivered
  } else if (newStatus === 'cancelled') {
    order.cancelledAt = new Date();
    order.paymentStatus = 'refunded'; // Optional: auto-refund logic later
  }

  await order.save();
  return order;
};
//getMyOrders
const getMyOrdersFromDB = async (
  email: string,
  query: Record<string, unknown>,
) => {
  const user = await User.findOne({ email: email });
  // console.log("User details from order service",user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }

  const orderQuery = new QueryBuilder(
    Order.find({user:user._id})
      .populate('user', 'name email')
      .populate('orderedProducts.product', 'name price'),
    query
  )
    .search(['status', 'paymentStatus', 'paymentMethod', 'contactNumber'])
    .filter()
    .sort()
    .paginate()
    .fields();
    const result = await orderQuery.modelQuery;
    const meta = await orderQuery.countTotal();
  
    return {
      meta,
      result,
    };
  };
export const OrderService = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusByAdmin,
  getMyOrdersFromDB
};
