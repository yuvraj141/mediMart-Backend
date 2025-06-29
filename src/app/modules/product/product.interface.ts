import { Types } from "mongoose";

export type TProduct = {
  name: string;
  brand: Types.ObjectId;
  category:  Types.ObjectId; 
  description?: string;
  price: number;
  discountPrice?:number|null;
  stock: number;
  images: string[]; // Cloudinary URLs
  prescriptionRequired: boolean;
  expiryDate?: Date;
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
