import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { DiscountServices } from './discount.service';
import catchAsync from '../../utlis/catchAsync';
import sendResponse from '../../utlis/sendResponse';

export const createDiscount = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // Create discount and recalc product discounts inside service
  const result = await DiscountServices.createDiscountIntoDB(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Discount created successfully',
    data: result,
  });
});

export const updateDiscount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  // Update discount and recalc product discounts inside service
  const result = await DiscountServices.updateDiscountIntoDB(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discount updated successfully!',
    data: result,
  });
});

export const getAllActiveDiscounts = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountServices.getAllActiveDiscountProducts(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discounts retrieved successfully!',
    data: result,
  });
});

export const getSingleDiscount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DiscountServices.getSingleDiscountFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discount retrieved successfully!',
    data: result,
  });
});

export const deleteDiscount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DiscountServices.deleteDiscountFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discount deleted successfully!',
    data: result,
  });
});

export const discountControllers = {
  createDiscount,
  updateDiscount,
  getAllActiveDiscounts,
  getSingleDiscount,
  deleteDiscount,
};
