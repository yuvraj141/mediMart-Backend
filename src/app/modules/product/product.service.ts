import { Product } from './product.model';
import { TProduct } from './product.interface';
import { sendImageToCloudinary } from '../../utlis/sendImageToCloudinary';
import { Category } from '../category/category.model';
import { Brand } from '../brand/brand.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { ProductSearchableFields } from './product.const';
//createProductIntoDB
const createProductIntoDB = async (
  files: any[],
  payload: TProduct)=> {

  const imageUrls: string[] = [];

const isCategoryExists = await Category.findById(payload.category);
  if (!isCategoryExists) {
    throw new Error('Invalid category ID. Category does not exist.');
  }

  const isBrandExists = await Brand.findById(payload.brand);
  if (!isBrandExists) {
    throw new Error('Invalid brand ID. Brand does not exist.');
  }
  // Upload images to Cloudinary
  if (files && files.length > 0) {
    for (const file of files) {
      const imageName = `${payload.name}`;
      const path = file?.path;

      const { secure_url } = await sendImageToCloudinary(imageName, path);
      imageUrls.push(secure_url as string);
    //   console.log('Uploaded Image URL from service:', secure_url);
    }
  }
  payload.images = imageUrls;
  const result = await Product.create(payload);
  return result;
};
//update product
const updateProductIntoDB = async (
  id: string,
  payload: Partial<TProduct>,
  files: Express.Multer.File[]
) => {

  // 1. Validate brand/category if needed
  if (payload.brand) {
    const brand = await Brand.findById(payload.brand);
    if (!brand) throw new Error('Invalid brand ID');
  }

  if (payload.category) {
    const category = await Category.findById(payload.category);
    if (!category) throw new Error('Invalid category ID');
  }

  // 2. Start with existing images array from payload
  // eslint-disable-next-line prefer-const
  let updatedImages = payload.images || [];

  // 3. Upload new files and append to updatedImages
  if (files && files.length > 0) {
    for (const file of files) {
      const imageName = `${payload.name || 'product'}`;
      const path = file.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      updatedImages.push(secure_url as string);
    }
  }

  // 4. Replace images array with the final one
  payload.images = updatedImages;

  // 5. Update product
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};
//getAllProduct
const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find().populate('brand', 'name').populate('category', 'name'),
    query
  )
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return { result, meta };
};
//getSingle
const getSingleProductFromDB=async(id:string)=>{
  const result=await Product.findById(id)
  return result
}
export const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB
};
