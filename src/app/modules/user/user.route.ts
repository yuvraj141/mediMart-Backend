import express, { NextFunction, Request, Response } from "express"
import { upload } from "../../utlis/sendImageToCloudinary"
import { UserControllers } from "./user.controller";

import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
const router=express.Router()
//createUser
router.post('/create-user',upload.single('file'),(req: Request, res: Response, next: NextFunction) => {
   
    req.body = JSON.parse(req.body.data);
    
    next();
  },validateRequest(userValidation.userValidationSchema),UserControllers.registerUser)
  //getSingleUser
  router.get('/:id',UserControllers.getSingleUser)
//getAllUser
router.get('/',UserControllers.getAllUsers)
//update userDetails
router.patch('/:id',UserControllers.updateUser)

  export const UserRoutes=router