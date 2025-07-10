import { Types } from "mongoose";
export interface IFlashSale {
  product: Types.ObjectId;
  discountPercentage: number;
  
}
export interface ICreateFlashSaleInput {
  products: string[];
  discountPercentage: number;
}
// export type TDiscount = {
//   title: string;
//   description?: string;
//   discountPercentage: number; 
//   startDate: Date;
//   endDate: Date;
//   applicableTo: 'all' | 'category' | 'brand' ;
//   categories?: string[]; // Category IDs
//   brands?: string[];     // Brand IDs
//   products?: string[];   // Product IDs
//   isActive?: boolean;
// };
