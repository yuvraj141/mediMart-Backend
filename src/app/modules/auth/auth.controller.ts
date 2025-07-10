
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import config from "../../config";
import catchAsync from "../../utlis/catchAsync";
import sendResponse from "../../utlis/sendResponse";

const loginUser=catchAsync(async(req,res)=>{
    const result=await AuthServices.loginUser(req.body)
    const {refreshToken,accessToken}=result
    //setting the access token in the cookie
    res.cookie("refreshToken",refreshToken,{
        secure:config.node_env==="production",
        httpOnly:true,
        sameSite:true,
        maxAge:1000*60*60*24*365
    })
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"User logged in successfully",
        data:{
            accessToken,
            refreshToken
        }
    })
})
//change password
const changePassword =catchAsync(async(req,res)=>{
    // console.log("req.body",req.body,"req.user",req.user)
    const {...passwordData}=req.body

    const result=await AuthServices.changePassword(req.user,passwordData)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"password updated successfully",
        data:result
    })
})
//refresh token
const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token is retrieved successfully!',
      data: result,
    });
  });
  export const AuthControllers={
    loginUser,
    changePassword,
    refreshToken,
    // forgetPassword,
    // resetPassword,
    
}