import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";

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

]
moduleRoutes.forEach((route)=>router.use(route.path,route.route))
export default router