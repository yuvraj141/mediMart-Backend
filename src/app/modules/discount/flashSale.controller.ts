import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { DiscountServices, FlashSaleService } from './flashSale.service';
import catchAsync from '../../utlis/catchAsync';
import sendResponse from '../../utlis/sendResponse';

export const createFlashSale = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await FlashSaleService.createFlashSale(payload)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'FlashSale created successfully',
    data: result,
  });
});
//getAllActiveFlashSalesService
const getActiveFlashSales=catchAsync(async(req,res)=>{
  const result = await FlashSaleService.getActiveFlashSalesService(
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Flash Sale retrieved successfully',
    meta: result.meta,
    data: result.result
  });
})


export const discountControllers = {
  createFlashSale,
  getActiveFlashSales
};
