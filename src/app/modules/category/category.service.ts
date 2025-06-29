import { Category } from './category.model';
import { TCategory } from './category.interface';
import { sendImageToCloudinary } from '../../utlis/sendImageToCloudinary';
import QueryBuilder from '../../builder/QueryBuilder';

//Create category
 
const createCategoryIntoDB = async (file:any,payload: TCategory) => {
    if(file){
    //send image to Cloudinary**
    const imageName=`${payload?.name}`
    const path=file?.path
    
    const {secure_url}=await sendImageToCloudinary(imageName,path)
    payload.imgIcon=secure_url as string
    console.log("secure url :",secure_url);
    }
  const result = await Category.create(payload);
  return result;
};

//getAll Categories
const  getAllCategoriesFromDB=async(query:Record<string,unknown>)=>{
   

const CategoryQuery=new QueryBuilder(Category.find(),query).search(['name']).filter().sort().paginate().fields()

const result=await CategoryQuery.modelQuery
const meta=await CategoryQuery.countTotal()

return {result,meta}
}
//getSingleCategoryFromDB
const getSingleCategoryFromDB=async(id:string)=>{
const result=await Category.findById(id)
console.log(result);
console.log("Category JSON:", result?.toJSON());
return result
}

//Update  category
const updateCategoryIntoDB = async (
  id: string,
  file: any,
  payload: Partial<TCategory>,
) => {
  if (file && file.path) {
    const imageName = payload?.name || 'category-image'; 
    const path = file.path;

    const { secure_url } = await sendImageToCloudinary(imageName, path);

    payload.imgIcon = secure_url as string;
  }

  const result = await Category.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true }
  );

  return result;
};


//Delete a category
const deleteCategoryFromDB = async (id: string) => {
  const result = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};


export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB
};
