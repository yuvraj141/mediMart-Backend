import { NextFunction, Request, RequestHandler, Response } from "express"


const catchAsync=(fn:RequestHandler)=>{
  //higher order function.error will be set to global error handler
  return (req:Request,res:Response,next:NextFunction)=>{
Promise.resolve(fn(req,res,next)).catch((err)=>next(err))
}
}

export default catchAsync
