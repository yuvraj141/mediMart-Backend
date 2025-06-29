import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';
import AppError from '../../errors/AppError';
import httpStatus from "http-status";
const categorySchema = new Schema<TCategory>(
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
    imgIcon: {
      type: String,
      required:true, // optional Cloudinary URL
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
//before creating category checking the category already exists
categorySchema.pre('save',async function (next) {
    const isCategoryExists=await Category.findOne({
        name:this.name
    })
    if(isCategoryExists){
        throw new AppError(httpStatus.NOT_FOUND,"This Category Already Exists")
    }
    next()
})
export const Category = model<TCategory>('Category', categorySchema);
