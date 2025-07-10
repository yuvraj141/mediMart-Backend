import { Schema, model } from 'mongoose';
import { TOrder } from './order.interface';
import { Product } from '../product/product.model';
import { Discount } from '../discount/flashSale.model';
// import AppError from '../../errors/appError';

const orderSchema = new Schema<TOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    orderedProducts: {
      type: [
        {
          product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, required: true, min: 1 },
          unitPrice: { type: Number, required: true },
          discountApplied: { type: Number, default: 0 },
          discountAmount: { type: Number, default: 0 },
        },
      ],
      required: true,
    },

    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'processing', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'online'],
      default: 'cod',
    },

    shippingAddress: {
      type: {
        city: { type: String, required: true },
        roadNo: { type: String },
        houseNo: { type: String },
        fullAddress: { type: String, required: true },
      },
      required: true,
    },

    contactNumber: { type: String, required: true },
    prescriptionUrls: [{ type: String }],
    notes: { type: String },

    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

// Pre-save logic to calculate subtotal, discounts, delivery charge, finalAmount
orderSchema.pre('validate', async function (next) {
  const order = this;

  let subtotal = 0;
  let discountAmount = 0;

  const now = new Date();
  const activeDiscounts = await Discount.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  for (const item of order.orderedProducts) {
    const product = await Product.findById(item.product)
      .populate('category', '_id')
      .populate('brand', '_id');

    if (!product) return next(new Error( 'Product not found.'));

    const unitPrice = product.price;
    item.unitPrice = unitPrice;

    const itemSubtotal = unitPrice * item.quantity;
    subtotal += itemSubtotal;

    let bestDiscount = 0;

    for (const discount of activeDiscounts) {
      const { applicableTo, brands, categories, discountPercentage } = discount;

      if (applicableTo === 'all') {
        bestDiscount = Math.max(bestDiscount, discountPercentage);
        continue;
      }

      const matchesCategory =
        categories?.length && product.category
          ? categories.some((cId: any) => cId.equals(product.category._id))
          : false;

      const matchesBrand =
        brands?.length && product.brand
          ? brands.some((bId: any) => bId.equals(product.brand._id))
          : false;

      if (
        (applicableTo === 'category' && matchesCategory) ||
        (applicableTo === 'brand' && matchesBrand) ||
        (matchesCategory || matchesBrand)
      ) {
        bestDiscount = Math.max(bestDiscount, discountPercentage);
      }
    }

    const productDiscountAmount = (bestDiscount / 100) * itemSubtotal;
    discountAmount += productDiscountAmount;

    item.discountApplied = bestDiscount;
    item.discountAmount = Math.floor(productDiscountAmount);
  }

  const isDhaka = order.shippingAddress.city?.toLowerCase() === 'dhaka';
  const deliveryCharge = isDhaka ? 60 : 120;

  order.subtotal = Math.round(subtotal);
  order.discountAmount = Math.round(discountAmount);
  order.deliveryCharge = deliveryCharge;
  order.finalAmount = Math.round(subtotal - discountAmount + deliveryCharge);

  next();
});

export const Order = model<TOrder>('Order', orderSchema);
