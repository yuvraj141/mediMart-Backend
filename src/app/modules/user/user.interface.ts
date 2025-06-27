import { Model } from "mongoose";
import { USER_ROLE } from "./user.const";

export interface TUSer{
    id?:string;
    name:string;
    email:string;
    password:string;
    address:string;
    imgUrl:string;
    contactNo:number;
    role:'admin'|'superAdmin'|'customer';
    status:'active'|'blocked';
    isActive:boolean,
    createdAt:Date;
    updatedAt:Date,
}

export interface UserModel extends Model<TUSer>{
    // eslint-disable-next-line no-unused-vars
    isUserExistsByEmail(email:string):Promise<TUSer>;


    // eslint-disable-next-line no-unused-vars
    isPasswordMatched(plainTextPassword:string,
        // eslint-disable-next-line no-unused-vars
        hashedPassword:string
    ):Promise<boolean>
}

export type TUserRole=keyof typeof USER_ROLE