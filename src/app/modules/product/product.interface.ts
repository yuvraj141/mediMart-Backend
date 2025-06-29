export type TProduct = {
  _id?: string;
  name: string;
  brand: string;
  category: string; // ObjectId as string (referencing Category)
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[]; // Cloudinary URLs
  prescriptionRequired: boolean;
  expiryDate?: Date;
  isAvailable?: boolean;
  createdBy?: string; // Admin user ID
  createdAt?: Date;
  updatedAt?: Date;
};
