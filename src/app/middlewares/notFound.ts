import { NextFunction, Request,Response } from "express";
import httpStatus from "http-status";
//notFound handling
const notFound=(req:Request,res:Response,next:NextFunction)=>{

    return res.status(httpStatus.NOT_FOUND).json({
      success:false,
      message:'Api not found',
      error:null
    })
  }
  export default notFound
  