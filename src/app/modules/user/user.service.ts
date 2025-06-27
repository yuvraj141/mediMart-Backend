import QueryBuilder from "../../builder/QueryBuilder";
import { sendImageToCloudinary } from "../../utlis/sendImageToCloudinary";
import { userSearchableFields } from "./user.const";
import { TUSer } from "./user.interface";
import { User } from "./user.model";

//register
const registerUserIntoDB=async(file:any,payLoad:TUSer)=>{
    const isUserExists=await User.findOne({email:payLoad.email})
    if(isUserExists){
        throw new Error("This User already exists!")
    }
   
   if(file){
//send image to Cloudinary**
const imageName=`${payLoad?.name}`
const path=file?.path

const {secure_url}=await sendImageToCloudinary(imageName,path)
payLoad.imgUrl=secure_url as string
console.log("secure url :",secure_url);
}

const result=await User.create(payLoad)
return result

}
//getAll Users
const getAllUsersFromDB=async(query:Record<string,unknown>)=>{
    console.log('base query from user service',query);

const UserQuery=new QueryBuilder(User.find(),query).search(userSearchableFields).filter().sort().paginate().fields()

const result=await UserQuery.modelQuery
const meta=await UserQuery.countTotal()

return {result,meta}
}
//getSingleUser
const getSingleUserFromDB=async(id:string)=>{
const result=await User.findById(id)

return result
}
//updateUser
const updateUserIntoDB=async(id:string,payLoad:Partial<TUSer>)=>{
    const result=await User.findByIdAndUpdate({
        _id:id
    },payLoad,{new:true})
    return result
}
export const UserServices={
  registerUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB
}