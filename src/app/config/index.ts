import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path:path.join((process.cwd(),'.env'))})
export default {
    node_env:process.env.NODE_ENV,
    port:process.env.PORT,
    database_url:process.env.DATABASE_URL,
    bcrypt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret:process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret:process.env.  JWT_REFRESH_SECRET,
    jwt_access_expires_in:process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in:process.env.JWT_REFRESH_EXPIRES_IN,
    cloudinary_cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
   cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
   cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET,
   stripe_secret_key:process.env.STRIPE_SECRET_KEY,
    stripe_publishable_key:process.env.STRIPE_PUBLISHABLE_KEY,
    stripe_webhook_secret:process.env.STRIPE_WEBHOOK_SECRET_KEY
}