import express from 'express';
const app = express();
const port = process.env.PORT || 4000;
import authRoute from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use('/',authRoute);

app.get('/',(req,res)=>{
   return res.status(200).json({
        message:"Welcome 😍🤗"
    })
})
app.listen(port,()=>{
    console.log("server runing on ",port)
})