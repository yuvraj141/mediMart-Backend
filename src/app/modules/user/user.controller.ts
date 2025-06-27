import catchAsync from "../../utlis/catchAsync";
import sendResponse from "../../utlis/sendResponse";
import httpStatus from 'http-status';
import { UserServices } from "./user.service";
const registerUser=catchAsync(async(req,res)=>{
  
const result=await UserServices.registerUserIntoDB(req.file,req.body)

   sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    
    data: result,
  });
  
})
//getAllUsers
const getAllUsers=catchAsync(async(req,res)=>{
console.log('from user controller',req.query);
const result=await UserServices.getAllUsersFromDB(req.query)

 sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:'Users are retrieved successfully',
      data:result
      
  })
})
///getSingleUser
const getSingleUser=catchAsync(async(req,res)=>{
  const {id}=req.params
  const result=await UserServices.getSingleUserFromDB(id)
  sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:'Students are retrieved successfully',
      data:result
      
  })
})
//updateUser
const updateUser=catchAsync(async(req,res)=>{
  const {id}=req.params
  const data=req.body
  const result=await UserServices.updateUserIntoDB(id,data)
  
 sendResponse(res,{
  statusCode:httpStatus.OK,
  success:true,
  message:"User data updated successfully",
  data:result
 })
})
export const UserControllers={
    registerUser,
    getAllUsers,
    getSingleUser,
    updateUser
}