import { Schema, model, Types } from 'mongoose';
import { TProduct } from './product.interface';
import { Discount, FlashSale } from '../discount/flashSale.model';

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

productSchema.methods.calculateOfferPrice=async function(){
  const flashSale=await FlashSale.findOne({product:this._id})
  if(flashSale){
    const discount=(flashSale.discountPercentage/100)*this.price
    return this.price-discount
  }
  return null
}

export const Product = model<TProduct>('Product', productSchema);
