import { Schema, model } from 'mongoose';

import AppError from '../../errors/AppError';
import httpStatus from "http-status";
import { TBrand } from './brand.interface';
const brandSchema = new Schema<TBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required:true,
       trim: true,
    },
    logo: {
      type: String,
      required:true, 
    },
    isActive:{
        type:Boolean,
        default:true
    }
  },
  {
    timestamps: true,
  }
);
//before creating Brand checking the category already exists
brandSchema.pre('save',async function (next) {
    const isBrandExists=await Brand.findOne({
        name:this.name
    })
    if(isBrandExists){
        throw new AppError(httpStatus.NOT_FOUND,"This Brand Already Exists")
    }
    next()
})
export const Brand = model<TBrand>('Brand', brandSchema);
