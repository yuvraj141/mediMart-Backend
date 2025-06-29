import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { ProductRoutes } from "../modules/product/product.route";

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
        path:'/product',
        route:ProductRoutes
    },

]
moduleRoutes.forEach((route)=>router.use(route.path,route.route))
export default router