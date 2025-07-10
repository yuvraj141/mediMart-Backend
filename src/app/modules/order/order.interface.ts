import { Types } from "mongoose";

export type TOrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';
export type TPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type TPaymentMethod = 'cod' | 'card' | 'online';

export type TShippingAddress = {
  city: string;
  roadNo?: string;
  houseNo?: string;
  fullAddress: string;
};

export type TOrderedProduct = {
  product: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  discountApplied?: number; // in %
  discountAmount?: number;  // in currency
};

export type TOrder = {
  user: Types.ObjectId;
  orderedProducts: TOrderedProduct[];

  subtotal: number;               // total before discount
  discountAmount?: number;        // total discount across all items
  deliveryCharge: number;
  finalAmount: number;            // subtotal - discount + delivery

  status: TOrderStatus;
  paymentStatus: TPaymentStatus;
  paymentMethod: TPaymentMethod;

  shippingAddress: TShippingAddress;

  contactNumber: string;
  prescriptionUrls?: string[];
  notes?: string;

  deliveredAt?: Date;
  cancelledAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
};
