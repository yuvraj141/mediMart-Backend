
import { sendImageToCloudinary } from '../../utlis/sendImageToCloudinary';
import QueryBuilder from '../../builder/QueryBuilder';
import { TBrand } from './brand.interface';
import { Brand } from './brand.model';

//Create Brand
 
const createBrandIntoDB = async (file:any,payload: TBrand) => {
    if(file){
    //send image to Cloudinary**
    const imageName=`${payload?.name}`
    const path=file?.path
    
    const {secure_url}=await sendImageToCloudinary(imageName,path)
    payload.logo=secure_url as string
    console.log("secure url :",secure_url);
    }
  const result = await Brand.create(payload);
  return result;
};

//getAll Brands
const  getAllBrandsFromDB=async(query:Record<string,unknown>)=>{
   

const BrandQuery=new QueryBuilder(Brand.find(),query).search(['name']).filter().sort().paginate().fields()

const result=await BrandQuery.modelQuery
const meta=await BrandQuery.countTotal()

return {result,meta}
}
//getSingleBrandFromDB
const getSingleBrandFromDB=async(id:string)=>{
const result=await Brand.findById(id)

return result
}

//Update  Brand
const updateBrandIntoDB = async (
  id: string,
  file: any,
  payload: Partial<TBrand>,
) => {
  if (file && file.path) {
    const imageName = payload?.name || 'brand-image'; 
    const path = file.path;

    const { secure_url } = await sendImageToCloudinary(imageName, path);

    payload.logo = secure_url as string;
  }

  const result = await Brand.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true }
  );

  return result;
};


//Delete a brand
const deleteBrandFromDB = async (id: string) => {
  const result = await Brand.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};


export const BrandServices = {
  createBrandIntoDB,
  getAllBrandsFromDB,
  getSingleBrandFromDB,
  updateBrandIntoDB,
  deleteBrandFromDB
};
