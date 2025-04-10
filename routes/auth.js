import express from "express";
import user from "../config/db.js";
const router = express.Router();
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    for (let i = 0; i < user.length; i++) {
      if (user[i].email === email) {
        if (user[i].password === password) {
          const token = await jwt.sign({ user_email: email }, process.env.JWT_SECRET);
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // The maximum age of the cookie in milliseconds (1 hour in this case)
            sameSite: process.env.NODE_ENV === "production" ? 'none':'strict', // Helps prevent cross-site request forgery (CSRF) attacks
          });
          return res.status(200).json({
            user: user[i]
          });
        } else {
          return res.status(200).json({ error: "Invalid password" });
        }
      }
    }
    return res.status(404).json({
      message: "user not found",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});




router.get("/profile",async(req,res)=>{
   try {
    const token = req.cookies.token;
    if(!token){
        return res.status(404).json({
            message: "token not found",
          });
    }
    const verify = await jwt.verify(token,process.env.JWT_SECRET);
    if(!verify){
        return res.status(40).json({
            message: "token invalid",
          });
    }
    return res.status(200).json({
        user:verify,
      });
   } catch (error) {
    return res.status(500).json({
        message: error.message,
      });
   }
})

export default router;
