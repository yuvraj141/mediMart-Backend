import express from 'express';

import { discountValidations } from './flashSale.validation';
import validateRequest from '../../middlewares/validateRequest';
import { discountControllers } from './flashSale.controller';

const router = express.Router();

// Create discount
router.post('/create-flashSale',
  validateRequest(discountValidations.createFlashSaleValidationSchema),
  discountControllers.createFlashSale
);

// // Update discount
// router.patch(
//   '/update-discount/:id',
//   validateRequest(discountValidations.updateDiscountValidationSchema),
//   discountControllers.updateDiscount
// );


export const FlashSaleRoutes = router;
