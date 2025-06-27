import express, { Application, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import router from './app/routes'
import globalErrorHandler from './app/middlewares/globalErrorHandlers'
import notFound from './app/middlewares/notFound'
const app:Application=express()
//parsers
app.use(express.json())
app.use(cookieParser())
//middleWare setup
// app.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

//
app.use('/api/v1',router)
app.get('/',(req:Request,res:Response)=>{
    res.send("Hello from backend")
})
app.use(globalErrorHandler)
app.use(notFound)
export default app