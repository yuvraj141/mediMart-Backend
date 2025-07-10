import { Router } from 'express';

import { couponController } from './coupon.controller';
import validateRequest from '../../middlewares/validateRequest';
import { couponValidations } from './coupon.validation';


const router = Router();

//create-coupon
router.post('/create-coupon', validateRequest(couponValidations.createCouponValidationSchema),couponController.createCoupon);
//get all coupon
router.get('/', couponController.getAllCoupon);
//update coupon
router.patch(
   '/update-coupon/:couponCode',
   validateRequest(couponValidations.updateCouponValidationSchema),
   couponController.updateCoupon
);
//get single coupon
router.get(
   '/:couponCode',
   couponController.getCouponByCode
);
//delete
router.delete(
   '/:couponId',
   couponController.deleteCoupon
);

export const CouponRoutes = router;
