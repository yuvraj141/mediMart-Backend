import express, { NextFunction,Request,Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utlis/sendImageToCloudinary';
import { productValidations } from './product.validation';
import { productControllers } from './product.controller';

const router=express.Router()
router.post('/create-product',upload.array('file',4),(req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },validateRequest(productValidations.createProductValidationSchema),productControllers.createProduct)
//update
router.patch(
  '/update-product/:id',
  upload.array('file', 4),
  (req: Request, res: Response, next: NextFunction) => {
    // Parse the main payload
    if (typeof req.body.data === 'string') {
      req.body = JSON.parse(req.body.data);
    }

    // Parse images array if sent as JSON string
    if (typeof req.body.images === 'string') {
      req.body.images = JSON.parse(req.body.images);
    }

    next();
  },
  validateRequest(productValidations.updateProductValidationSchema),
  productControllers.updateProduct
);
//trending products
router.get('/trending-products',productControllers.getTrendingProducts)
//getAll
router.get('/',productControllers.getAllProducts)
//getSingle
router.get('/:id',productControllers.getSingleProduct)
// /delete
router.delete('/delete/:productId',productControllers.deleteProduct)
  export const ProductRoutes=router