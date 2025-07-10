import { z } from 'zod';
import mongoose from 'mongoose';

// ✅ Reusable ObjectId checker
const objectIdValidator = z.string({ required_error: 'ObjectId is required' }).refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  {
    message: 'Invalid ObjectId format',
  }
);

export const createOrderValidationSchema = z.object({
  body: z.object({
    user: objectIdValidator,

    orderedProducts: z
      .array(
        z.object({
          product: objectIdValidator,
          quantity: z
            .number({ required_error: 'Quantity is required' })
            .int({ message: 'Quantity must be an integer' })
            .min(1, 'Quantity must be at least 1'),
        })
      )
      .min(1, { message: 'At least one ordered product is required' }),

    shippingAddress: z.object({
      city: z.string({ required_error: 'City is required' }),
      roadNo: z.string().optional(),
      houseNo: z.string().optional(),
      fullAddress: z.string({ required_error: 'Full address is required' }),
    }),

    contactNumber: z
      .string({ required_error: 'Contact number is required' })
      .min(11, 'Contact number must be at least 11 digits'),

    prescriptionUrls: z.array(z.string().url('Invalid URL')).optional(),

    notes: z.string().optional(),

    paymentMethod: z
      .enum(['cod', 'card', 'online'])
      .optional()
      .default('cod'),
  }),
});


export const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['processing', 'delivered', 'cancelled'], {
      required_error: 'Status is required',
      invalid_type_error: 'Status must be one of: processing, delivered, cancelled',
    }),
  }),
});


export const orderValidations={
    createOrderValidationSchema,
    updateOrderStatusValidationSchema
}