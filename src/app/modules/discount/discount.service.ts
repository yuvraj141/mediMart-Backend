import { Discount } from './discount.model';
import { TDiscount } from './discount.interface';
import { Category } from '../category/category.model';
import { Brand } from '../brand/brand.model';
import { Product } from '../product/product.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';


const createDiscountIntoDB = async (discountData: TDiscount) => {
  const { applicableTo, categories, brands, discountPercentage } = discountData;

  if (!['all', 'brand', 'category'].includes(applicableTo)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Discount can only be applied to all, brand, or category.');
  }

  if (applicableTo === 'brand') {
    if (!brands?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'At least one brand is required.');
    }
    const existingBrands = await Brand.find({ _id: { $in: brands } });
    if (existingBrands.length !== brands.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Some brands are invalid.');
    }
  }

  if (applicableTo === 'category') {
    if (!categories?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'At least one category is required.');
    }
    const existingCategories = await Category.find({ _id: { $in: categories } });
    if (existingCategories.length !== categories.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Some categories are invalid.');
    }
  }

  const discount = await Discount.create(discountData);

  // Just find affected products and set discountId (no price calculation now)
  let filter: Record<string, any> = {};

  if (applicableTo === 'all') {
    filter = {};
  } else if (applicableTo === 'brand') {
    filter = { brand: { $in: brands } };
  } else if (applicableTo === 'category') {
    filter = { category: { $in: categories } };
  }

  const affectedProducts = await Product.find(filter).select('_id');

  const bulkOps = affectedProducts.map((product) => ({
    updateOne: {
      filter: { _id: product._id },
      update: {
        $set: {
          discountId: discount._id,
        },
      },
    },
  }));

  if (bulkOps.length > 0) {
  const result = await Product.bulkWrite(bulkOps);
  console.log('bulkWrite result:', result);
}


  return discount;
};

// Helper to safely get string ID from populated or non-populated values
const getIdString = (field: any): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (field._id) return field._id.toString();
  return field.toString();
};

export const getAllActiveDiscountProducts = async (query: Record<string, unknown>) => {
  const now = new Date();

  // Run query to get active discounts (typed as any[] to avoid TS errors)
  const discountQuery = new QueryBuilder(
    Discount.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      isActive: true,
    })
      .populate('brands', 'name')
      .populate('categories', 'name')
      .populate('products', 'name price'),
    query
  )
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate();

  const activeDiscountsRaw: any[] = await discountQuery.modelQuery.lean();
  const meta = await discountQuery.countTotal();

  const finalData = [];

  for (const discount of activeDiscountsRaw) {
    // Destructure with safe defaults
    const {
      _id,
      title = '',
      description = '',
      discountPercentage = 0,
      startDate = new Date(),
      endDate = new Date(),
      applicableTo = '',
      brands = [],
      categories = [],
      products = [],
    } = discount;

    // Build product filter based on applicableTo
    let productFilter: Record<string, any> = {};

    if (applicableTo === 'all') {
      productFilter = {};
    } else if (applicableTo === 'brand') {
      const brandIds = brands.map((b: any) => getIdString(b));
      productFilter.brand = { $in: brandIds };
    } else if (applicableTo === 'category') {
      const categoryIds = categories.map((c: any) => getIdString(c));
      productFilter.category = { $in: categoryIds };
    } else if (applicableTo === 'product') {
      const productIds = products.map((p: any) => getIdString(p));
      productFilter._id = { $in: productIds };
    }

    // Fetch affected products
    const affectedProducts = await Product.find(productFilter)
      .populate('brand', 'name')
      .populate('category', 'name')
      .select('name price brand category')
      .lean();

    if (affectedProducts.length === 0) continue; // skip if no products

    // Map products with discount price
    const productsWithDiscount = affectedProducts.map((product) => {
      const discountPrice = Math.round(product.price * (1 - discountPercentage / 100));
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        discountPrice,
        brand: product.brand,
        category: product.category,
      };
    });

    // Push discount info with products to final array
    finalData.push({
      _id,
      title,
      description,
      discountPercentage,
      validFrom: new Date(startDate).toISOString().split('T')[0],
      validTo: new Date(endDate).toISOString().split('T')[0],
      applicableTo,
      brands,
      categories,
      products: productsWithDiscount,
    });
  }

  return {
     result: finalData,
      meta,
  
  };
};


//updateDiscountIntoDB
const updateDiscountIntoDB = async (
  id: string,
  payload: Partial<TDiscount>
): Promise<TDiscount | null> => {
  const { applicableTo, brands, categories } = payload;

  // 1. Validate applicableTo value
  if (applicableTo && !['all', 'brand', 'category'].includes(applicableTo)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid applicableTo type.');
  }

  // 2. Validate brand/category IDs if applicable
  if (applicableTo === 'brand' && brands?.length) {
    const existingBrands = await Brand.find({ _id: { $in: brands } });
    if (existingBrands.length !== brands.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'One or more brand IDs are invalid.');
    }
  }

  if (applicableTo === 'category' && categories?.length) {
    const existingCategories = await Category.find({ _id: { $in: categories } });
    if (existingCategories.length !== categories.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'One or more category IDs are invalid.');
    }
  }

  // 3. Update the discount in DB
  const updatedDiscount = await Discount.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedDiscount) {
    throw new AppError(httpStatus.NOT_FOUND, 'Discount not found.');
  }

  // 4. Prepare filter for updating products
  let productFilter: Record<string, any> = {};

  if (updatedDiscount.applicableTo === 'all') {
    productFilter = {};
  } else if (updatedDiscount.applicableTo === 'brand') {
    productFilter = { brand: { $in: updatedDiscount.brands } };
  } else if (updatedDiscount.applicableTo === 'category') {
    productFilter = { category: { $in: updatedDiscount.categories } };
  }

  // 5. Reset old discountIds (remove this discountId from all products)
  await Product.updateMany(
    { discountId: updatedDiscount._id },
    { $unset: { discountId: '' } }
  );

  // 6. Apply this discountId to newly matched products
  const affectedProducts = await Product.find(productFilter).select('_id');

  const bulkOps = affectedProducts.map((product) => ({
    updateOne: {
      filter: { _id: product._id },
      update: {
        $set: {
          discountId: updatedDiscount._id,
        },
      },
    },
  }));

  if (bulkOps.length > 0) {
    await Product.bulkWrite(bulkOps);
  }

  return updatedDiscount;
};

//getSingleDiscountFromDB
const getSingleDiscountFromDB = async (id: string) => {
  const discount = await Discount.findById(id)
    .populate('categories', 'name')
    .populate('brands', 'name')
    // .populate('products', 'name price') // uncomment if needed
    .lean();

  if (!discount) {
    throw new Error('Discount not found');
  }

  return discount;
};


//deleteDiscountFromDB
const deleteDiscountFromDB = async (id: string) => {
  // Delete the discount first
  const deletedDiscount = await Discount.findByIdAndDelete(id);

  if (!deletedDiscount) {
    throw new Error('Discount not found or already deleted');
  }

  // Optional: Remove discountId from products that referenced this discount
  await Product.updateMany(
    { discountId: deletedDiscount._id },
    { $unset: { discountId: "" } }
  );

  return deletedDiscount;
};


export const DiscountServices = {
  createDiscountIntoDB,
  getAllActiveDiscountProducts,
  getSingleDiscountFromDB,
  updateDiscountIntoDB,
  deleteDiscountFromDB
  
};