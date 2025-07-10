import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { ProductRoutes } from "../modules/product/product.route";
import {  FlashSaleRoutes } from "../modules/discount/flashSale.route";
import { OrderRoutes } from "../modules/order/order.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CouponRoutes } from "../modules/coupon/coupon.routes";

const router=Router()

const moduleRoutes=[
    {
        path:'/users',
        route:UserRoutes
    },
    {
        path:'/category',
        route:CategoryRoutes
    },
    {
        path:'/brand',
        route:BrandRoutes
    },
    {
        path:'/products',
        route:ProductRoutes
    },
    {
        path:'/flashSale',
        route:FlashSaleRoutes
    },
    {
        path:'/coupon',
        route:CouponRoutes
    },
    {
        path:'/order',
        route:OrderRoutes
    },
    {
        path:'/auth',
        route:AuthRoutes
    },
    {
        path:'/admin',
        route:AdminRoutes
    },
]
moduleRoutes.forEach((route)=>router.use(route.path,route.route))
export default router