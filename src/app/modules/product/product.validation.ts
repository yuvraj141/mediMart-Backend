import { z } from 'zod';

export const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Product name is required',
    }),
    brand: z.string({
      required_error: 'Brand ID is required',
    }), 
    category: z.string({
      required_error: 'Category ID is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    price: z.number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    }),
    discountPrice: z
      .number({
        invalid_type_error: 'Discount price must be a number',
      })
      .nullable()
      .optional(),
    stock: z.number({
      required_error: 'Stock is required',
      invalid_type_error: 'Stock must be a number',
    }),
  }),
});

export const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    discountPrice: z.number().nullable().optional(),
    stock: z.number().optional(),
  }),
});
export const productValidations={
    createProductValidationSchema,
     updateProductValidationSchema,
}