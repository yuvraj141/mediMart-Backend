import { Schema, model, Types } from 'mongoose';
import { TProduct } from './product.interface';
import { Discount } from '../discount/discount.model';

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountId: {
      type: Schema.Types.ObjectId,
      ref: 'Discount',
      default: null,
    },
    stock: {
      type: Number,
      required: true,
    },
    images: {
      type: [String], 
      required: true,
    },
    prescriptionRequired: {
      type: Boolean,
      required: true,
      default: false,
    },
    expiryDate: {
      type: Date,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.methods.calculateOfferPrice = async function () {
  const now = new Date();

  // Find all active discounts applicable to this product
  const discounts = await Discount.find({
    startDate: { $lte: now },
    endDate: { $gte: now },
    isActive: true,
    $or: [
      { applicableTo: 'all' },
      { applicableTo: 'brand', brands: this.brand },
      { applicableTo: 'category', categories: this.category },
    ],
  }).lean();

  if (discounts.length === 0) {
    // Optionally clear discountId if no active discount
    if (this.discountId) {
      this.discountId = null;
      await this.save();
    }
    return null;
  }

  // Find the max discount percentage and the discountId
  let maxDiscount = 0;
  let bestDiscountId: Types.ObjectId | null = null;

  for (const disc of discounts) {
    if (disc.discountPercentage > maxDiscount) {
      maxDiscount = disc.discountPercentage;
      bestDiscountId = disc._id;
    }
  }

  // Update discountId if changed
  if (!this.discountId || !this.discountId.equals(bestDiscountId)) {
    this.discountId = bestDiscountId;
    await this.save();
  }

  // Calculate the discounted price
  if (maxDiscount > 0) {
    return Math.round(this.price * (1 - maxDiscount / 100));
  }

  return null;
};

export const Product = model<TProduct>('Product', productSchema);
