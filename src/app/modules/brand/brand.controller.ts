import httpStatus from "http-status";

import catchAsync from "../../utlis/catchAsync";
import sendResponse from "../../utlis/sendResponse";
import { BrandServices } from "./brand.service";

//createBrand
const createBrand=catchAsync(async(req,res)=>{
    const result=await BrandServices.createBrandIntoDB(req.file,req.body)

   sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand is created successfully',
    
    data: result,
  });
})
//updateBrand
const updateBrand=catchAsync(async(req,res)=>{
  const { id } = req.params;
  const data = req.body;
  const file = req.file;
  const result = await BrandServices.updateBrandIntoDB(id, file, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand data updated successfully',
    data: result,
  });
})
//getSingleBrand
const getSingleBrand=catchAsync(async(req,res)=>{
    const {id}=req.params
    const result=await BrandServices.getSingleBrandFromDB(id)

     sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand data is retrieved successfully',
    
    data: result,
  });
})
//getAllBrand
const getAllBrand =catchAsync( async (req, res) => {

    const result = await BrandServices.getAllBrandsFromDB(req.query);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:'All Brands are retrieved successfully',
      data:result
      
  })
});
//deleteBrand
const deleteBrand=catchAsync(async(req,res)=>{
      const {id}=req.params
    const result=await BrandServices.deleteBrandFromDB(id)
     sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand is deleted successfully',
    
    data: result,
  });
})
export const brandControllers={
    createBrand,
    updateBrand,
    getAllBrand,
    getSingleBrand,
    deleteBrand
}