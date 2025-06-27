import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

//to catch mongoose error.but before that errors will caught from zod.as a next level dev we will also setup this for better error handling

const handleValidationError=(err:mongoose.Error.ValidationError):TGenericErrorResponse=>{
    const errorSources:TErrorSources=Object.values(err.errors).map((val:mongoose.Error.ValidatorError |mongoose.Error.CastError)=>{
        return {
            path:val?.path,
            message:val?.message
        }
    })
  
    const statusCode=400
    return{
        statusCode,
        message:"Validation Error",
        errorSources,
       
    }
}
export default handleValidationError