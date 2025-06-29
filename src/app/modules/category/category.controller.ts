

import httpStatus from "http-status";
import { CategoryServices } from "./category.service";
import catchAsync from "../../utlis/catchAsync";
import sendResponse from "../../utlis/sendResponse";

//createCategory
const createCategory=catchAsync(async(req,res)=>{
    const result=await CategoryServices.createCategoryIntoDB(req.file,req.body)

   sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is created successfully',
    
    data: result,
  });
})
//updateCategory
const updateCategory=catchAsync(async(req,res)=>{
  const { id } = req.params;
  const data = req.body;
  const file = req.file;
console.log(req.body,"from controller");
  const result = await CategoryServices.updateCategoryIntoDB(id, file, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
})
//getSingleCategory
const getSingleCategory=catchAsync(async(req,res)=>{
    const {id}=req.params
    const result=await CategoryServices.getSingleCategoryFromDB(id)

     sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is retrieved successfully',
    
    data: result,
  });
})
//getAllCategory
const getAllCategory =catchAsync( async (req, res) => {
//   console.log(req.query);
    const result = await CategoryServices.getAllCategoriesFromDB(req.query);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:'All categories are retrieved successfully',
      data:result
      
  })
});
//deleteCategory
const deleteCategory=catchAsync(async(req,res)=>{
      const {id}=req.params
    const result=await CategoryServices.deleteCategoryFromDB(id)
     sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is deleted successfully',
    
    data: result,
  });
})
export const categoryControllers={
    createCategory,
    updateCategory,
    getAllCategory,
    getSingleCategory,
    deleteCategory
}