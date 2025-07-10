import { Request, Response } from 'express';

import catchAsync from '../../utlis/catchAsync';
import sendResponse from '../../utlis/sendResponse';
import { adminServices } from './admin.service';

export const AdminStatistics = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  // Convert to Date only if provided
  const dateRange: { startDate?: Date; endDate?: Date } = {};
  if (startDate) dateRange.startDate = new Date(startDate as string);
  if (endDate) dateRange.endDate = new Date(endDate as string);

  const result = await adminServices.getAdminStatistics(dateRange);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin stats fetched successfully!',
    data: result,
  });
});
export const adminController={
    AdminStatistics
}