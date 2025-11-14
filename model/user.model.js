import mongoose  from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema(
{
   name:{
    type:String,
    required: [true, "Name is required"],
    trim:true,
    minlength: 5, 
    maxlength: 50
   },
   email:{
    type:String,
    required: [true, "Email is required"],
    unique:[true,"email is already existing"],
    lowercase:true,
    trim:true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address",
    },


   },
   //password is not required when google signUp is there 
   password:{
   type:String,
   required: function () {
    return !this.isGoogleUser; 
  },
   validate: {
      validator: function (v) {
        return validator.isStrongPassword(v, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
      message:"Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
    },
},



   googleId: {
      type: String,
      unique: true,
    
    },

    isGoogleUser: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
   
    profileImage:{
    type:String,

   },
   lastLogin:{
    type:Date,
   },
   
},
{
    timestamps: true, 
}
)

userSchema.pre('save',async function (next) {
    if(!this.isModified("password") || this.isGoogleUser) return next
    const salt= await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)
    next()
    
})

 const User=mongoose.model('user',userSchema)
 
 export default User

