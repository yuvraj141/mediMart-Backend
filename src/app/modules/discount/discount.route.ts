import express from 'express';

import { discountValidations } from './discount.validation';
import validateRequest from '../../middlewares/validateRequest';
import { discountControllers } from './discount.controller';

const router = express.Router();

// Create discount
router.post('/create-discount',
  validateRequest(discountValidations.createDiscountValidationSchema),
  discountControllers.createDiscount
);

// Update discount
router.patch(
  '/update-discount/:id',
  validateRequest(discountValidations.updateDiscountValidationSchema),
  discountControllers.updateDiscount
);
// Delete discount
router.delete('/delete-discount/:id', discountControllers.deleteDiscount);
// Get all discounts
router.get('/active-discounts', discountControllers.getAllActiveDiscounts);

//  Get single discount
router.get('/:id', discountControllers.getSingleDiscount);

export const DiscountRoutes = router;
