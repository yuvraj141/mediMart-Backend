import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { TProduct } from './product.interface';
import catchAsync from '../../utlis/catchAsync';
import { ProductServices } from './product.service';
import sendResponse from '../../utlis/sendResponse';

// Create Product
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const payload = req.body;
// console.log(files,"from controller");
  const result = await ProductServices.createProductIntoDB(files, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully!',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  const payload = req.body; // Already parsed in the route middleware

  const result = await ProductServices.updateProductIntoDB(id, payload, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});
////getAll
const getAllProducts=catchAsync(async(req,res)=>{
   
    const result=await ProductServices.getAllProductsFromDB(req.query)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"products  retrieved successfully",
        data:result.result,
        meta:result.meta
    })
})
//getSingleProduct
const getSingleProduct=catchAsync(async(req,res)=>{
  const {productId}=req.params
  const result=await ProductServices.getSingleProductFromDB(productId)

   sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"product  retrieved successfully",
        data:result
    })
})
//getTrendingProducts
const getTrendingProducts = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const result = await ProductServices.getTrendingProducts(Number(limit));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trending Products are retrieved successfully",
    data: result,
  });
});
// hard delete
const deleteProduct = catchAsync(async (req, res) => {
  const {productId} = req.params;

  const result = await ProductServices.deleteProduct(
    productId );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});
export const productControllers={
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    getTrendingProducts,
    deleteProduct
}