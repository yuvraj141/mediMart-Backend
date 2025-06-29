import express, { NextFunction,Request,Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { categoryValidation } from './category.validation';
import { categoryControllers } from './category.controller';
import { upload } from '../../utlis/sendImageToCloudinary';

const router=express.Router()
router.post('/create-category',upload.single('file'),(req: Request, res: Response, next: NextFunction) => {
   
    req.body = JSON.parse(req.body.data);
    
    next();
  },validateRequest(categoryValidation.createCategoryValidationSchema),categoryControllers.createCategory)
router.get('/',categoryControllers.getAllCategory)
router.get('/:id',categoryControllers.getSingleCategory)
router.patch('/:id',upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body.data); // ✅ parse JSON string if needed
    }
    next();
  },validateRequest(categoryValidation.updateCategoryValidationSchema),categoryControllers.updateCategory)
export const CategoryRoutes = router;