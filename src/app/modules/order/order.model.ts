import { Schema, model } from 'mongoose';
import { TOrder } from './order.interface';

const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderedProducts: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min:0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid','Failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "Online",
    },
     deliveryCharge: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    prescriptionUrls: {
      type: [String], 
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<TOrder>('Order', orderSchema);
