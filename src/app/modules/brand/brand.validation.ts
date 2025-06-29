import { z } from 'zod';

export const createBrandValidationSchema = z.object({
 
body:z.object({
   name: z.string({
    required_error: 'Brand name is required',
  }),

  logo: z
    .string({
      required_error: 'Brand logo is required',
    }).optional(),
    description:z .string({
      required_error: 'Description is required',
    }),

})

});
export const updateBrandValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
    description: z.string().optional(),
  }),
});
export const brandValidation={
    createBrandValidationSchema,
   updateBrandValidationSchema
}