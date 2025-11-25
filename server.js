import express from 'express'
import { appConfig } from './config/app_config'
import { db_config } from './config/db_config'
import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose'
import cors from 'cors'
import {errorHandler} from './middleware/error.middleware.js';

import userRoutes from './routes/user.routes.js'
import transactionRoutes from "./routes/transaction.routes.js"
const app=express()
app.use(express.json());
app.use(cors())
app.use("/expenseTracker/api/v1/user", userRoutes);
app.use("/expenseTracker/api/v1/transaction",transactionRoutes)



app.use(errorHandler)

mongoose.connect(db_config.DB_URL) 
const db=mongoose.connection
db.on('error',()=>{
    console.log('error while connecting to db')
})
db.once('open',()=>{
    console.log('connecting to db')
})






app.listen(appConfig.PORT,()=>{
    console.log('server connected to:',appConfig.PORT)
})
