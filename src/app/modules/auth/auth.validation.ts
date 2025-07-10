import { z } from "zod";

const loginValidationSchema=z.object({
    body:z.object({
        email:z.string({required_error:'Email is required'}),
        password:z.string({required_error:'Password id required'})
    })
})
const changePasswordValidationSchema=z.object({
    body:z.object({
      oldPassword:z.string({required_error:'Old password is required'}),
        newPassword:z.string({required_error:'new Password is required'})
    })
})
const refreshTokenValidationSchema = z.object({
    cookies: z.object({
      refreshToken: z.string({
        required_error: 'Refresh token is required!',
      }),
    }),
  });

const forgetPasswordValidationSchema =z.object({
  body:z.object({
    id:z.string({
      required_error:'User id is required'}),
    
  })
})
const resetPasswordValidationSchema =z.object({
  body:z.object({
    id:z.string({
      required_error:'User id is required'}),
    newPassword:z.string({
      required_error:'User password is required'}),
    
  })
})
  
export const AuthValidation={
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema
}

//http://localhost:3000?id=A-0003&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzkzNTM5NjksImV4cCI6MTczOTM1NDU2OX0.BGxU6a9ppMoe6bmrpcj_wNk1p9etTdR-bW58oxYcIbE