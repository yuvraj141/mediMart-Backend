import { z } from 'zod';
 const createCouponValidationSchema = z.object({
  body: z.object({
    code: z
      .string({
        required_error: 'Coupon code is required',
      })
      .trim()
      .min(1, 'Coupon code cannot be empty')
      .transform((val) => val.toUpperCase()),

    discountType: z.enum(['Flat', 'Percentage'], {
      required_error: 'Discount type is required',
    }),

    discountValue: z
      .number({
        required_error: 'Discount value is required',
      })
      .min(0, 'Discount value cannot be negative'),

    minOrderAmount: z
      .number()
      .min(0, 'Minimum order amount cannot be negative')
      .default(0),

    maxDiscountAmount: z
      .number()
      .min(0, 'Maximum discount amount cannot be negative')
      .nullable()
      .optional(),

    startDate: z.coerce.date({
      required_error: 'Start date is required',
    }),

    endDate: z.coerce.date({
      required_error: 'End date is required',
    }),

    isActive: z.boolean().optional().default(true),
    isDeleted: z.boolean().optional().default(false),
  }),
});

 const updateCouponValidationSchema = z.object({
   body: z
      .object({
         code: z.string().trim().toUpperCase().optional(),
         discountType: z.enum(['Flat', 'Percentage']).optional(),
         discountValue: z.number().min(0).optional(),
         minOrderAmount: z.number().min(0).optional(),
         maxDiscountAmount: z.number().nullable().optional(),
         startDate: z.date().optional(),
         endDate: z.date().optional(),
         isActive: z.boolean().optional(),
      })
      .strict(),
});
export const couponValidations={
   createCouponValidationSchema,
   updateCouponValidationSchema
}