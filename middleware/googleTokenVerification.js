//step1:copy the keys of firebase from firebase inside the utils/firebaseAdmin
//step2:middleware for google token verification coming from frontend 

import admin from "firebase-admin"    // install this
import { firebaseAdmin } from "../utils/firebaseAdmin"   // import from utils


admin.initializeApp({
    credential:admin.credential.cert(firebaseAdmin)
})

// for token verification of google 
export const googleTokenVerification=async(req,res,next)=>{
    try{
      let authValue=req.headers.authorization
      if(!authValue || !authValue.includes('Bearer')){
        console.log(authValue)
          return res.status(401).send({
            message:'unauthorized token '
          })
      }
      const googleToken=authValue.replace('Bearer','')
     const decodedData=await admin.auth().verifyIdToken(googleToken)
     console.log(decodedData)
     req.googleData=decodedData
     next()
    }
    catch(err){
      console.log(err)
      next(err)
    }
}