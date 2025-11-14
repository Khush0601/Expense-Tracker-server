import jwt from "jsonwebtoken"

//step1:generateToken for that make utils/jwt.js
//step2:add generateToken in signUp
//step3:verifyToken middleware for verifying the token which is sent by the frontend 
//step4:after verifying make a controller that will fetch the whole detail of user for autoLogin
//step5:make routes for autoLogin means:1st api,[verifyToken],controller

export const verifyToken=async(req,res,next)=>{
   const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.userId = decoded.userId; 
    next();
  }
  catch(err){
    next(err)
  }


}