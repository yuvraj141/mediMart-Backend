import { z } from 'zod';

export const createFlashSaleValidationSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        product: z
          .string({
            required_error: "Product ID is required",
            invalid_type_error: "Product ID must be a string",
          })
          .min(1, "Product ID cannot be empty"),
        discountPercentage: z
          .number({
            required_error: "Discount percentage is required",
            invalid_type_error: "Discount percentage must be a number",
          })
          .min(0, "Discount percentage cannot be less than 0")
          .max(100, "Discount percentage cannot be more than 100"),
      })
    ).min(1, "At least one product is required in flash sale")
  })
});

// //update
// export const updateDiscountValidationSchema = z.object({
//   body: z.object({
//       title: z.string().optional(),
//       description: z.string().optional(),
//       discountPercentage: z
//         .number()
//         .min(0, { message: 'Discount must be at least 0%' })
//         .max(100, { message: 'Discount must not exceed 100%' })
//         .optional(),

//       startDate: z
//         .string()
//         .refine((date) => !isNaN(Date.parse(date)), {
//           message: 'Invalid start date format',
//         })
//         .optional(),

//       endDate: z
//         .string()
//         .refine((date) => !isNaN(Date.parse(date)), {
//           message: 'Invalid end date format',
//         })
//         .optional(),

//       applicableTo: z.enum(['all', 'category', 'brand', 'product']).optional(),
//       categories: z.array(z.string()).optional(),
//       brands: z.array(z.string()).optional(),
//       products: z.array(z.string()).optional(),
//     })
//     .refine(
//       (data) => {
//         if (data.startDate && data.endDate) {
//           const start = new Date(data.startDate);
//           const end = new Date(data.endDate);
//           return end > start;
//         }
//         return true;
//       },
//       {
//         message: 'End date must be after start date',
//         path: ['endDate'],
//       }
//     ),
// });
export const discountValidations = {
  createFlashSaleValidationSchema
};
