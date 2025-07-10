import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { orderValidations } from './order.validation';
import { orderControllers } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router=express.Router()
router.post('/create-order',validateRequest(orderValidations.createOrderValidationSchema),orderControllers.createOrder)
//change-order-status for admin
router.patch('/change-status/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin),validateRequest(orderValidations.updateOrderStatusValidationSchema),orderControllers.updateOrderStatus)
//getMyOrders for customer
router.get('/my-ordered-products',auth(USER_ROLE.customer),orderControllers.getMyOrders)
//getSingle
router.get('/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin),orderControllers.getSingleOrder)
//getAll orders for admin
router.get('/',auth(USER_ROLE.admin,USER_ROLE.superAdmin),orderControllers.getAllOrders)
export const OrderRoutes = router;