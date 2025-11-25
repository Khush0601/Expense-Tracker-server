import User from "../model/user.model.js";
import bcrypt from "bcrypt"
import generateToken from "../utils/jwt.js";

import crypto from "crypto"


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
   const token = generateToken(user._id)
   const { password: userPassword, ...userData } = user._doc;
   res.status(200).json({
    message:'Login successfully',
    token, 
    user:userData
   });
 }
 catch(error){
    next(error)
 }
}

// googleLogin  check for default:
export const googleLogin=async(req,res)=>{
     try{
     
     const {name,picture,email,uid,email_verified}=req.googleData
     let query= {$or:[{googleId:{$regex:uid,$options:'i'}},{email:{$regex:email,$options:'i'}}]}
     let userData=await User.findOne(query)
     if(userData){
      const token=generateToken(userData._id)
      const {password,...restData}=userData._doc
      return res.status(200).send({
        user:restData,
        token
      })
     }
     else{
      const userObj={
        name:name,
        email:email,
        picture:picture,
        password:bcrypt.hashSync(crypto.randomBytes(16)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 16),8),
        googleId:uid,
        isGoogleLogin:true,
       }
      const savingUser=await UserModel.create(userObj)
      
      if(savingUser){
        const token=generateToken(savingUser._id)
        const {password,...restData}=savingUser._doc
        return res.status(200).send({
          user:restData,
          token
        })
      }
      else{
        return res.status(500).send({
          message:'something went wrong'
        })
      }
     }
     
     
     }
     catch(err){
      console.log(err)
      res.status(500).send({
        message:'error while signIn',
        error:err.message
      })
     }
}

export const autoLogin = async (req, res,next) => {
  try {
    
    const user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
  
    res.status(200).send({ user });
  } catch (err) {
    console.error(err);
    next(err)
  }
};

// export const googleSignUp=async(req,res,next)=>{

// }
