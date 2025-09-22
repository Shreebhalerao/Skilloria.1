const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


require("dotenv").config();

exports.auth = async (req, res, next) => {
  

  try {
    
    let token = null;

   
    if (req.headers?.authorization?.startsWith("Bearer ")) {
  token = req.headers.authorization.split(" ")[1];
  // remove surrounding quotes if any
  token = token.replace(/^"|"$/g, '');
}

    
console.log("Token received from client:", token); 
    if (!token) {
      console.log("❌ No token found in request");
      return res.status(401).json({
        success: false,
        message: "token is missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      

      req.user = decode;
      next();
    } catch (err) {
      console.error("❌ JWT verification failed:", err.message);
      return res.status(401).json({
        success: false,
        message: "token is invalid",
        error: err.message, // include reason
      });
    }
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    return res.status(401).json({
      success: false,
      message: "something went wrong while validating the token",
      error: err.message,
    });
  }
};



// for the student authoritation

exports.isStudent =async(req,res,next)=>{
    try {
        if(req.user.accountType !== "student"){
            return res.status(401).json({
                success:false,
                message:"this is the protected route for the students only"
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified , plz try again later"
        });
        
    }
}

//isInstructusr
exports.isInstructor =async(req,res,next)=>{
    try {
        if(req.user.accountType != "instructor"){
            return res.status(401).json({
                success:false,
                message:"this is the protected route for the instructor only"
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified , plz try again later"
        });
        
    }
}


//isAdmin
exports.isAdmin =async(req,res,next)=>{
    try {
        if(req.user.accountType !== "admin"){
            return res.status(401).json({
                success:false,
                message:"this is the protected route for the Admin only"
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified , plz try again later"
        });
        
    }
}
