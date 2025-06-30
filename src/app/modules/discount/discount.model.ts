import { Schema, model } from 'mongoose';
import { TDiscount } from './discount.interface';

const discountSchema = new Schema<TDiscount>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    applicableTo: {
      type: String,
      enum: ['all', 'category', 'brand', 'product'],
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    brands: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Discount = model<TDiscount>('Discount', discountSchema);
