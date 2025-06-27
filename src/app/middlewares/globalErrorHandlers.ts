import { error } from "console";
import { ErrorRequestHandler} from "express";
import { ZodError, ZodIssue } from "zod";
import { TErrorSources } from "../interface/error";
import config from "../config";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";

//error handling
const globalErrorHandler:ErrorRequestHandler=(err,req,res,next)=>{
  //setting default values
    let statusCode= 500;
    let message= 'something went wrong'
    
    let errorSources:TErrorSources=[
      {
      path:'',
      message:'something went wrong'
    }]
   //for zod error
    if(err instanceof ZodError){
   const simplifiedError=handleZodError(err)
   message=simplifiedError?.message
   errorSources=simplifiedError?.errorSources
   statusCode=simplifiedError?.statusCode
    }//for mongoose error
    else if(err?.name==='ValidationError'){
 const simplifiedError=handleValidationError(err)
 statusCode=simplifiedError.statusCode
 message=simplifiedError.message
 errorSources=simplifiedError.errorSources
    }//search by invalid id
    else if(err?.name==="CastError"){
      const simplifiedError=handleCastError(err)
 statusCode=simplifiedError.statusCode
 message=simplifiedError.message
 errorSources=simplifiedError.errorSources
    }//duplicate mongoose data error
    else if(err?.code===11000){
      const simplifiedError=handleDuplicateError(err)
 statusCode=simplifiedError.statusCode
 message=simplifiedError.message
 errorSources=simplifiedError.errorSources
    }
    //App error
    else if(err instanceof AppError){
 statusCode=err.statusCode
 message=err.message
 errorSources=[
  {
    path:'',
    message:err?.message
  }
 ]
    }//Error
    else if(err instanceof Error){
 message=err.message
 errorSources=[
  {
    path:'',
    message:err?.message
  }
 ]
    }
    //ultimate return
    return res.status(statusCode).json({
      success:false,
      message,
      errorSources,
      stack: config.NODE_ENV==='development'? err?.stack :null//only for development purpose.otherwise hacker will get the vulnerabilities
     // amiError:err
     // error:err
    })
  }
  export default globalErrorHandler
  // pattern
  // success
  // message
  // errorSources:[
  //   path:'',
  //   message:''
  // ]
  // stack(only for development purpose)