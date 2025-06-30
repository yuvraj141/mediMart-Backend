import { z } from 'zod';

const createDiscountValidationSchema = z.object({
  body: z
    .object({
      title: z.string({
        required_error: 'Discount title is required',
      }),
      description: z.string().optional(),
      discountPercentage: z
        .number({
          required_error: 'Discount percentage is required',
          invalid_type_error: 'Discount percentage must be a number',
        })
        .min(0, { message: 'Discount must be at least 0%' })
        .max(100, { message: 'Discount must not exceed 100%' }),

      startDate: z
        .string({
          required_error: 'Start date is required',
        })
        .refine((date) => !isNaN(Date.parse(date)), {
          message: 'Invalid start date format',
        })
        .refine((date) => new Date(date) > new Date(), {
          message: 'Start date must be in the future',
        }),

      endDate: z
        .string({
          required_error: 'End date is required',
        })
        .refine((date) => !isNaN(Date.parse(date)), {
          message: 'Invalid end date format',
        }),

      applicableTo: z.enum(['all', 'category', 'brand', 'product'], {
        required_error: 'Applicable to field is required',
      }),

      categories: z.array(z.string()).optional(),
      brands: z.array(z.string()).optional(),
      products: z.array(z.string()).optional(),
    })
    .refine(
      (data) => {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end > start;
      },
      {
        message: 'End date must be after start date',
        path: ['endDate'],
      }
    )
    .refine(
      (data) => {
        if (data.applicableTo === 'category') return !!data.categories?.length;
        if (data.applicableTo === 'brand') return !!data.brands?.length;
        if (data.applicableTo === 'product') return !!data.products?.length;
        return true;
      },
      {
        message: 'Relevant items must be selected based on applicableTo',
        path: ['applicableTo'],
      }
    ),
});
//update
export const updateDiscountValidationSchema = z.object({
  body: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      discountPercentage: z
        .number()
        .min(0, { message: 'Discount must be at least 0%' })
        .max(100, { message: 'Discount must not exceed 100%' })
        .optional(),

      startDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
          message: 'Invalid start date format',
        })
        .optional(),

      endDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
          message: 'Invalid end date format',
        })
        .optional(),

      applicableTo: z.enum(['all', 'category', 'brand', 'product']).optional(),
      categories: z.array(z.string()).optional(),
      brands: z.array(z.string()).optional(),
      products: z.array(z.string()).optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          const start = new Date(data.startDate);
          const end = new Date(data.endDate);
          return end > start;
        }
        return true;
      },
      {
        message: 'End date must be after start date',
        path: ['endDate'],
      }
    ),
});
export const discountValidations = {
  createDiscountValidationSchema,
  updateDiscountValidationSchema,
};
