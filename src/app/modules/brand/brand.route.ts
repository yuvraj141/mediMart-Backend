import express, { NextFunction,Request,Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utlis/sendImageToCloudinary';
import { brandValidation } from './brand.validation';
import { brandControllers } from './brand.controller';

const router=express.Router()
//create brand
router.post('/create-brand',upload.single('file'),(req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },validateRequest(brandValidation.createBrandValidationSchema),brandControllers.createBrand)
  //getAll
router.get('/',brandControllers.getAllBrand)
//get Single
router.get('/:id',brandControllers.getSingleBrand)
//update
router.patch('/:id',upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body.data); // ✅ parse JSON string if needed
    }
    next();
  },validateRequest(brandValidation.updateBrandValidationSchema),brandControllers.updateBrand)
export const BrandRoutes = router;