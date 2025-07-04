import { Product } from './product.model';
import { TProduct } from './product.interface';
import { sendImageToCloudinary } from '../../utlis/sendImageToCloudinary';
import { Category } from '../category/category.model';
import { Brand } from '../brand/brand.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { ProductSearchableFields } from './product.const';
import { Discount } from '../discount/discount.model';

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
// Helper to safely get string ID from populated object or ID string
const getIdString = (field: any): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (field._id) return field._id.toString();
  return field.toString();
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const now = new Date();

  // Extract special filters for manual handling
  const {
    categories,
    brands,
    inStock,
    ratings,
    ...restQuery
  } = query;

  // Build filter object for mongoose find()
  const filter: Record<string, any> = {};

  // Filter by categories (array or comma separated string)
  if (categories) {
    const categoryArray = typeof categories === 'string'
      ? categories.split(',')
      : Array.isArray(categories)
        ? categories
        : [categories];
    filter.category = { $in: categoryArray };
  }

  // Filter by brands (array or comma separated string)
  if (brands) {
    const brandArray = typeof brands === 'string'
      ? brands.split(',')
      : Array.isArray(brands)
        ? brands
        : [brands];
    filter.brand = { $in: brandArray };
  }

  // Filter by stock availability
  if (inStock !== undefined) {
    filter.stock = inStock === 'true' ? { $gt: 0 } : 0;
  }

  // Filter by ratings (assuming numeric)
  if (ratings) {
    const ratingArray = typeof ratings === 'string'
      ? ratings.split(',')
      : Array.isArray(ratings)
        ? ratings
        : [ratings];
    filter.averageRating = { $in: ratingArray.map(Number) };
  }

  // Build product query with QueryBuilder
  const productQuery = new QueryBuilder(
    Product.find(filter)
      .populate('brand', 'name')
      .populate('category', 'name'),
    restQuery
  )
    .search(ProductSearchableFields) // your fields for search, e.g., ['name', 'description']
    .filter()
    .sort()
    .paginate()
    .fields();

  // Execute product query
  const products = await productQuery.modelQuery.lean();
  const meta = await productQuery.countTotal();

  if (products.length === 0) return { result: [], meta };

  // Fetch active discounts that apply now
  const activeDiscounts = await Discount.find({
    startDate: { $lte: now },
    endDate: { $gte: now },
    isActive: true,
  })
    .populate('categories', 'name')
    .populate('brands', 'name')
    .select(
      'applicableTo discountPercentage products categories brands startDate endDate isActive'
    )
    .lean();

  // Apply best discount per product
  const discountedProducts = products.map((product: any) => {
    let maxDiscount = 0;

    const productIdStr = getIdString(product._id);
    const brandIdStr = getIdString(product.brand);
    const categoryIdStr = getIdString(product.category);

    for (const discount of activeDiscounts) {
      const appliesToAll = discount.applicableTo === 'all';

      const appliesToProduct =
        discount.applicableTo === 'product' &&
        discount.products?.some((id: any) => id.toString() === productIdStr);

      const appliesToBrand =
        discount.applicableTo === 'brand' &&
        discount.brands?.some((brand: any) => getIdString(brand) === brandIdStr);

      const appliesToCategory =
        discount.applicableTo === 'category' &&
        discount.categories?.some((category: any) => getIdString(category) === categoryIdStr);

      if (appliesToAll || appliesToProduct || appliesToBrand || appliesToCategory) {
        maxDiscount = Math.max(maxDiscount, discount.discountPercentage);
      }
    }

    if (maxDiscount > 0) {
      product.discountPrice = Math.round(product.price * (1 - maxDiscount / 100));
      product.discountPercentage = maxDiscount;
    } else {
      product.discountPrice = null;
      product.discountPercentage = null;
    }

    return product;
  });

  return { result: discountedProducts, meta };
};

export { getAllProductsFromDB };



const getSingleProductFromDB = async (productId: string) => {
  const product = await Product.findById(productId).populate('brand category');

  if (!product) throw new Error('Product not found');
  if (!product.isAvailable) throw new Error('Product is not available');

  const discountPrice = await product.calculateOfferPrice();

  const productObj = product.toObject();
  return {
    ...productObj,
    discountPrice,
  };
};

export const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB
};
