import User from "../model/user.model.js";
import bcrypt from "bcrypt"
export const signUp=async(req,res,next)=>{
   try{
    const {name,email,password}=req.body

    if(!name || !email || ! password ){
        return res.status(400).json('all fields are required')
    }
    const existingUser=await User.findOne({email})
    if(existingUser){
        return res.status(409).json({ message: "Email already registered" });
    }
    const newUSer=await User.create({ name, email, password })
    res.status(201).json({
        success:true,
        message:"user registered successfully"
    })
   }
   catch(error){
     next(error)
   }
}

export const signIn=async(req,res,next)=>{
 try{
   const {email,password}=req.body;
   if(!email || !password){
    return res.status(400).json('all fields are required')
   }
   const user = await User.findOne({ email })
   if(!user){
     return res.status(400).json('email is not there please signUp');
   }

   const isPasswordCorrect = bcrypt.compareSync(password, user.password);
   if(!isPasswordCorrect){
     return res.status(401).json('Invalid credentials');
   }
   res.status(200).json({
    message:'Login successfully',
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
   });
 }
 catch(error){
    next(error)
 }
}