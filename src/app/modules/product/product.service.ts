import { Product } from './product.model';
import { TProduct } from './product.interface';
import { sendImageToCloudinary } from '../../utlis/sendImageToCloudinary';
import { Category } from '../category/category.model';
import { Brand } from '../brand/brand.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { ProductSearchableFields } from './product.const';
import { Discount, FlashSale } from '../discount/flashSale.model';
import { Order } from '../order/order.model';
import AppError from '../../errors/AppError';

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
//getAllProductsFromDB
const getAllProductsFromDB = async (query: Record<string, unknown>) => {
   const {
      minPrice,
      maxPrice,
      categories,
      brands,
      inStock,
      ratings,
      ...pQuery
   } = query;

   // Build the filter object
   const filter: Record<string, any> = {};

   // Filter by categories
   if (categories) {
      const categoryArray = typeof categories === 'string'
         ? categories.split(',')
         : Array.isArray(categories)
            ? categories
            : [categories];
      filter.category = { $in: categoryArray };
   }


   // Filter by brands
   if (brands) {
      const brandArray = typeof brands === 'string'
         ? brands.split(',')
         : Array.isArray(brands)
            ? brands
            : [brands]
      filter.brand = { $in: brandArray };
   }

   // Filter by in stock/out of stock
   if (inStock !== undefined) {
      filter.stock = inStock === 'true' ? { $gt: 0 } : 0;
   }

   // Filter by ratings
   if (ratings) {
      const ratingArray = typeof ratings === 'string'
         ? ratings.split(',')
         : Array.isArray(ratings) ? ratings : [ratings];
      filter.averageRating = { $in: ratingArray.map(Number) };
   }

   const productQuery = new QueryBuilder(
      Product.find(filter)
         .populate('category', 'name')
         .populate('brand', 'name'),
      pQuery
   )
      .search(['name', 'description'])
      .filter()
      .sort()
      .paginate()
      .fields()
      .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

   const products = await productQuery.modelQuery.lean();

   const meta = await productQuery.countTotal();

   // Get Flash Sale Discounts
   const productIds = products.map((product: any) => product._id);

   const flashSales = await FlashSale.find({
      product: { $in: productIds },
      discountPercentage: { $gt: 0 },
   }).select('product discountPercentage');

   const flashSaleMap = flashSales.reduce((acc, { product, discountPercentage }) => {
      //@ts-ignore
      acc[product.toString()] = discountPercentage;
      return acc;
   }, {});

   // Add offer price to products
   const updatedProducts = products.map((product: any) => {
      //@ts-ignore
      const discountPercentage = flashSaleMap[product._id.toString()];
      if (discountPercentage) {
         product.offerPrice = product.price * (1 - discountPercentage / 100);
      } else {
         product.offerPrice = null;
      }
      return product;
   });

   return {
      meta,
      result: updatedProducts,
   };
};

//getTrendingProducts
const getTrendingProducts = async (limit: number) => {
   const now = new Date();
   const last30Days = new Date(now.setDate(now.getDate() - 30));

   const trendingProducts = await Order.aggregate([
      {
         $match: {
            createdAt: { $gte: last30Days },
         },
      },
      {
         $unwind: '$products',
      },
      {
         $group: {
            _id: '$products.product',
            orderCount: { $sum: '$products.quantity' },
         },
      },
      {
         $sort: { orderCount: -1 },
      },
      {
         $limit: limit || 10,
      },
      {
         $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails',
         },
      },
      {
         $unwind: '$productDetails',
      },
      {
         $project: {
            _id: 0,
            productId: '$_id',
            orderCount: 1,
            name: '$productDetails.name',
            price: '$productDetails.price',
            offer: '$productDetails.offer',
            imageUrls: '$productDetails.imageUrls',
         },
      },
   ]);

   return trendingProducts;
};

//update product
const updateProductIntoDB = async (
  id: string,
  payload: Partial<TProduct>,
  files: Express.Multer.File[]
) => {
    const product=await Product.find({
      _id:id
    })
    if(!product){
      throw new Error('Product not found')
    }
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


const getSingleProductFromDB = async (productId: string) => {
  const product = await Product.findById(productId).populate('brand category');

  if (!product) throw new Error('Product not found');
  if (!product.isAvailable) throw new Error('Product is not available');

 const offerPrice = await product.calculateOfferPrice();
  const productObj = product.toObject();
  return {
    ...productObj,
    offerPrice,
  };
};
//delete product
const deleteProduct=async(productId:string)=>{
  return await Product.findByIdAndDelete(productId)
}
export const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  getTrendingProducts,
  deleteProduct
};
