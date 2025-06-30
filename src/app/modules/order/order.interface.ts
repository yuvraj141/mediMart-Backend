import { Types } from 'mongoose';

export type TOrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

export type TOrderedProduct = {
  product: Types.ObjectId;
  quantity: number;
  unitPrice:number
};

export type TOrder = {
  user: Types.ObjectId; 
  orderedProducts: TOrderedProduct[];
  totalPrice: number;
  status?: TOrderStatus;
  paymentStatus?:'pending'| 'paid' | 'unpaid';
  paymentMethod?: 'cod' | 'card' | 'online';
  deliveryCharge: number; 
  shippingAddress:string;
  contactNumber: string;
  prescriptionUrls?: string[]; 
  createdAt?: Date;
  updatedAt?: Date;
    // payment?: IPayment | null;//todo payment module
};
