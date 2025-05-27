
const User = require("../model/Usermodel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv")

exports.signup = async(req,res)=>{
   try{
    const {name , email , password} = req.body;
    const userexist  = await User.findOne({email});
    if(userexist){
        return res.status(500).json({
            success:false,
            message:"user already exist please login..."
        })
    }
    // valid user  // hash password and make entry to db
    let hashpassword;
    try{

       hashpassword = await bcrypt.hash(password , 10);
    }
    catch(error){
        console.log(error);

        res.status(400).json({
            success:false,
            message:"cannot hash this password"
        })
        
    }
    // entry to db
    const user = await User.create({
        name , email , password:hashpassword
    })
    res.status(200).json({
        success:true,
        user:user,
        message:"sign up succesfully"
    })
   }
   catch(error){
     console.log(error);
     res.status(500).json({
       message:"cannot signup right now please try gain later",
       success:false
     })   
   }
}
exports.login = async(req,res)=>{

   try{

   const {email , password}  = req.body;

   if( !email || !password ){
        console.log("fill all details");

        res.status(400).json({
            success:false,
            message:"please fill all detials"
        })  
   } 

   // check for user register or not

   const user = await User.findOne({email})

   if(!email ){
    console.log("register first");
    res.status(400).json({
        success:false,
        message:"user doesn't exist please signup first..."
    })
    
   }

   // user exist now check password

   const payload = {
    email: user.email,
    id:user._id
   }

   if(await bcrypt.compare(password , user.password)){
     // password valid
     // create token and allow login
     const token = jwt.sign(payload , process.env.JWT_SECRET , {
        expiresIn:"144h"
     })

    user.token = token;
    user.password = undefined; 
    const userResponse = user.toObject();
    // cookie
    const options = {
        expires : new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
    }

    res.cookie("cookies" , token , options ).status(200).json({
        success:true,
        message:"logged in succesfully",
        user:userResponse,
        token
    })
   }
   // password invalid
   else{
    console.log("password is invalid");
    res.status(400),json({
        message:"password is invalid",
        success:false
    })
   }

   }
   catch(error){
    console.log(error);

    res.status(500).json({
        message:"cannot login this time. try again later...",
        success:false
    })
    
   }

}

exports.checkAuth = async (req, res) => {
  try {
    // 1. Get token from cookies
    const token = req.body.token || req.cookies.token 

    // 2. If no token, return unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Find user (optional - if you want fresh user data)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // 5. Return user data
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Auth check error:", error);
    res.status(401).json({
      success: false,
      message: "Not authenticated" 
    });
  }
};