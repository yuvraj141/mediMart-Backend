import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../utlis/catchAsync';
import sendResponse from '../../utlis/sendResponse';
import httpStatus from 'http-status';
//createOrder
export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderPayload = req.body;
 
  const result = await OrderService.createOrderIntoDB(orderPayload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully!',
    data: result,
  });
});
//getAllOrders
export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  

  const result = await OrderService.getAllOrdersFromDB(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Orders retrieved successfully!',
    data: result,
  });
});
//getSingle
export const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await OrderService.getSingleOrderFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: order,
  });
});
//updateStatus
 const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['processing', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const updatedOrder = await OrderService.updateOrderStatusByAdmin(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Order status updated to ${status}`,
    data: updatedOrder,
  });
});
// getMyOrders
const getMyOrders = catchAsync(async (req, res) => {
  const email = req.user.userEmail;
  // console.log("email from controller req.user",req.user);
  const result = await OrderService.getMyOrdersFromDB(
    email,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My orders retrieved successfully',
    data: result,
  });
});

export const orderControllers={
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
    getMyOrders
}
