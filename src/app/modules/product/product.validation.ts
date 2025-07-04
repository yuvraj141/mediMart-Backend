import { z } from 'zod';
 const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }),
    brand: z.string({ required_error: 'Brand ID is required' }),
    category: z.string({ required_error: 'Category ID is required' }),
    prescriptionRequired: z.boolean().optional(),
    description: z.string({ required_error: 'Description is required' }),
    price: z.number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' }).nonnegative(),
    stock: z.number({ required_error: 'Stock is required', invalid_type_error: 'Stock must be a number' }).int().nonnegative(),
  }),
});

 const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional(),
    prescriptionRequired: z.boolean().optional(),
    description: z.string().optional(),
    price: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative().optional(),
  }),
});

export const productValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};

