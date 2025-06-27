import { z } from 'zod';

export const userValidationSchema = z.object({
 
body:z.object({
   name: z.string({
    required_error: 'Name is required',
  }),

  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),

  address: z.string({
    required_error: 'Address is required',
  }),
  // imgUrl: z.string().url('Invalid image URL'),

  contactNo: z
    .number({
      required_error: 'Contact number is required',
      invalid_type_error: 'Contact number must be a number',
    }),
})



});

export const userValidation={
    userValidationSchema,
   
}