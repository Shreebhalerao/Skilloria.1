const express = require("express");
const router = express.Router();

const{login,signUP,sendOTP,changePassword}=require("../controllers/Auth");
const{resetPasswordToken,resetPassword,}=require("../controllers/ResetPassword");
const {auth}=require("../middlewares/auth");

//routes for the login signup and authentication

//for login 
router.post("/login",login);
//for signup
router.post("/signUP",signUP);
//for sending the otp
router.post("/sendotp",sendOTP);
//for changing the pass
router.post("/changePassword",auth,changePassword);

//for reseting the pass
router.post("/resetPasswordToken",resetPasswordToken);

router.post("/resetPassword",resetPassword);

module.exports=router
