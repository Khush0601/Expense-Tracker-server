import User from "../model/user.model.js";
import bcrypt from "bcrypt"
import generateToken from "../utils/jwt.js";

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


