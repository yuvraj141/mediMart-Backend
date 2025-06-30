import { Discount } from './discount.model';
import { TDiscount } from './discount.interface';
import { Category } from '../category/category.model';
import { Brand } from '../brand/brand.model';
import { Product } from '../product/product.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createDiscountIntoDB = async (payload: TDiscount)=> {
  const { applicableTo, categories, brands, products } = payload;

  // Validate based on applicableTo type
  if (applicableTo === 'category') {
    if (!categories || categories.length === 0) {
      throw new Error('At least one category is required for category-based discount.');
    }
    const categoryExists = await Category.find({ _id: { $in: categories } });
    if (categoryExists.length !== categories.length) {
      throw new Error('One or more categories are invalid.');
    }
  }

  if (applicableTo === 'brand') {
    if (!brands || brands.length === 0) {
      throw new Error('At least one brand is required for brand-based discount.');
    }
    const brandExists = await Brand.find({ _id: { $in: brands } });
    if (brandExists.length !== brands.length) {
      throw new Error('One or more brands are invalid.');
    }
  }

  if (applicableTo === 'product') {
    if (!products || products.length === 0) {
      throw new Error('At least one product is required for product-based discount.');
    }
    const productExists = await Product.find({ _id: { $in: products } });
    if (productExists.length !== products.length) {
      throw new Error('One or more products are invalid.');
    }
  }
// Save the discount
  const result = await Discount.create(payload);
  return result;
};


//getAllActiveDiscountsFromDB
const getAllActiveDiscountsFromDB = async (query: Record<string, unknown>) => {
  const now = new Date();

  const discountQuery = new QueryBuilder(
    Discount.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      isActive: true,
    })
      .populate('categories', 'name')
      .populate('brands', 'name')
      .populate('products', 'name'),
    query
  )
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await discountQuery.modelQuery;
  const meta = await discountQuery.countTotal();

  return { result, meta };
};

//updateDiscountIntoDB
const updateDiscountIntoDB = async (
  id: string,
  payload: Partial<TDiscount>
): Promise<TDiscount | null> => {
  const { applicableTo, categories, brands, products } = payload;

  if (applicableTo === 'category' && categories?.length) {
    const categoryExists = await Category.find({ _id: { $in: categories } });
    if (categoryExists.length !== categories.length) {
      throw new Error('One or more category IDs are invalid.');
    }
  }

  if (applicableTo === 'brand' && brands?.length) {
    const brandExists = await Brand.find({ _id: { $in: brands } });
    if (brandExists.length !== brands.length) {
      throw new Error('One or more brand IDs are invalid.');
    }
  }

  if (applicableTo === 'product' && products?.length) {
    const productExists = await Product.find({ _id: { $in: products } });
    if (productExists.length !== products.length) {
      throw new Error('One or more product IDs are invalid.');
    }
  }

  const updated = await Discount.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updated;
};
//getSingleDiscountFromDB
const getSingleDiscountFromDB = async (id: string) => {
  const discount = await Discount.findById(id)
    .populate('categories', 'name')
    .populate('brands', 'name')
    .populate('products', 'name');

  if (!discount) {
    throw new Error('Discount not found');
  }

  return discount;
};

//deleteDiscountFromDB
const deleteDiscountFromDB = async (id: string) => {
  const deleted = await Discount.findByIdAndDelete(id);
  return deleted;
};

export const DiscountServices = {
  createDiscountIntoDB,
  getAllActiveDiscountsFromDB,
  getSingleDiscountFromDB,
  updateDiscountIntoDB,
  deleteDiscountFromDB
};