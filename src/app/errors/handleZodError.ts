import { ZodError, ZodIssue } from "zod"
import { TErrorSources, TGenericErrorResponse } from "../interface/error"

 //handling errors will be sent to frontEnd
  const handleZodError=(err:ZodError):TGenericErrorResponse=>{
      const errorSources:TErrorSources=err.issues.map((issue:ZodIssue)=>{
        return {
          path:issue?.path[issue.path.length-1],//getting the last index cz error is there
          message:issue.message
        }
      })
       const  statusCode=400
         return {
          statusCode,//zod validation error
           message:" validation error",
           errorSources
         }
    }
    export default handleZodError