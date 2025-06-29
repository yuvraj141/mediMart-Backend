import { z } from 'zod';

export const createCategoryValidationSchema = z.object({
 
body:z.object({
   name: z.string({
    required_error: 'Name is required',
  }),

  imgIcon: z
    .string({
      required_error: 'ImageIcon is required',
    }).optional(),
    description:z .string({
      required_error: 'Description is required',
    }),

})

});
export const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    imgIcon: z.string().optional(),
    description: z.string().optional(),
  }),
});
export const categoryValidation={
    createCategoryValidationSchema,
   updateCategoryValidationSchema
}