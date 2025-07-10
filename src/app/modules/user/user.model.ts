import { model, Schema } from "mongoose";
import { TUSer, UserModel } from "./user.interface";
import { UserStatus } from "./user.const";
import bcrypt from 'bcrypt'
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
const userSchema=new Schema<TUSer,UserModel>(
{
name:{
    type:String,
    required:true
},
    email:{
         type:String,
    required:true,
    unique:true
    },
    password:{
    type:String,
    required:true,
    select:0
    },
    contactNo:{
        type:Number,
        
    },
    address:{
  type:String,
  
    },
    role:{
        type:String,
        enum:['superAdmin','admin','customer'],
        default:'customer'
    },
    status:{
        type:String,
        enum:UserStatus,
        default:'active'
    },
    isActive:{
        type:Boolean,
        default:true
    },
    imgUrl:{
        type:String,
        
    }
   
},{
    timestamps:true
}
)
userSchema.pre('save',async function(next){
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user=this
  user.password=await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  )
next()
})
userSchema.post('save',function(doc,next){
    doc.password=''
    next()
})
//checkUser
userSchema.statics.isUserExistsByEmail=async function(email:string){

   return await User.findOne({ email }).select('+password');
    // if(isUserExists){
    //     throw new AppError(httpStatus.CONFLICT,"This User already Exists")
    // }
}
//pass
userSchema.statics.isPasswordMatched=async function(plainTextPassword,hashedPassword){
    return await bcrypt.compare(plainTextPassword,hashedPassword)
}
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number){
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
    //we are doing it to check if the password is changed after the jwt is issued .this will help to prevent the user from using the old jwt token.hackers cant use the old jwt token to access the system
  return passwordChangedTime > jwtIssuedTimestamp;
};
export const User=model<TUSer,UserModel>('User',userSchema)