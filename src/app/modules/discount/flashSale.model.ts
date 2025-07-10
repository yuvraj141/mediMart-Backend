import { Schema, model } from "mongoose";
import { IFlashSale } from "./flashSale.interface";
// import { IFlashSale } from "./flashSale.interface";

const flashSaleSchema = new Schema<IFlashSale>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    discountPercentage: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: 0,
      max: 100,
    }
  },
  { timestamps: true }
);

export const FlashSale = model<IFlashSale>("FlashSale", flashSaleSchema);

// import { Schema, model } from 'mongoose';
// import { TDiscount } from './discount.interface';

// const discountSchema = new Schema<TDiscount>(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//     },
//     discountPercentage: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 100,
//     },
//     startDate: {
//       type: Date,
//       required: true,
//     },
//     endDate: {
//       type: Date,
//       required: true,
//     },
//     applicableTo: {
//       type: String,
//       enum: ['all', 'category', 'brand'],
//       required: true,
//     },
//     categories: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: 'Category',
//       },
//     ],
//     brands: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: 'Brand',
//       },
//     ],
  
//     isActive: {        
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Discount = model<TDiscount>('Discount', discountSchema);
