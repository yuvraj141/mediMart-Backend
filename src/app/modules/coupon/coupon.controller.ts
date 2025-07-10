import { Request, Response } from 'express';
import catchAsync from '../../utlis/catchAsync';
import { CouponService } from './coupon.service';
import sendResponse from '../../utlis/sendResponse';
import httpStatus from "http-status";
// createCoupon 
const createCoupon = catchAsync(async (req: Request, res: Response) => {
   const result = await CouponService.createCouponIntoDB(req.body);

   sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Coupon created successfully',
      data: result,
   });
});
//getAllCoupon
const getAllCoupon = catchAsync(async (req: Request, res: Response) => {
   const result = await CouponService.getAllCoupon(req.query);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Coupons retrieved successfully',
      data: result,
   });
});
//updateCoupon
const updateCoupon = catchAsync(async (req: Request, res: Response) => {
   const { couponCode } = req.params;
   const result = await CouponService.updateCoupon(req.body, couponCode);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Coupon updated successfully',
      data: result,
   });
});
//getCouponByCode 
const getCouponByCode = catchAsync(async (req: Request, res: Response) => {
   const { couponCode } = req.params;
   const { orderAmount } = req.body;

   const result = await CouponService.getCouponByCode(orderAmount, couponCode);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Coupon fetched successfully',
      data: result,
   });
});
const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
   const { couponId } = req.params;

   const result = await CouponService.deleteCoupon(couponId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Coupon deleted successfully',
      data: result,
   });
});

export const couponController = {
   createCoupon,
   getAllCoupon,
   updateCoupon,
   getCouponByCode,
   deleteCoupon,
};
