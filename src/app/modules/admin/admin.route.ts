import express from 'express';

import { adminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';


const router=express.Router()

router.get('/statistics',adminController.AdminStatistics)
// router.get('/statistics',auth(USER_ROLE.admin,USER_ROLE.superAdmin),adminController.AdminStatistics)

export const AdminRoutes = router;