import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';

import { USER_ROLE } from '../user/user.const';
import auth from '../../middlewares/auth';
const router = express.Router();
//for login no authGuard needed
router.post('/login', validateRequest(AuthValidation.loginValidationSchema),AuthControllers.loginUser);

//changePassword
router.post('/change-password', auth(USER_ROLE.admin,USER_ROLE.customer,USER_ROLE.superAdmin),validateRequest(AuthValidation.changePasswordValidationSchema),AuthControllers.changePassword);

// //forget password
// router.post('/forget-password',validateRequest(AuthValidation.forgetPasswordValidationSchema),AuthControllers.forgetPassword);
//reset password
// router.post('/reset-password',validateRequest(AuthValidation.resetPasswordValidationSchema),AuthControllers.resetPassword);
//refreshToken
router.post('/refresh-token',validateRequest(AuthValidation.refreshTokenValidationSchema),AuthControllers.refreshToken);

export const AuthRoutes = router;