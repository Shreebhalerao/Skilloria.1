const User = require("../models/User");
const OTP =require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt =require("bcrypt");
const jwt =require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const{passwordUpdated} =require("../mail/templates/passwordUpdate");



//send otp

exports.sendOTP=async(req,res)=>{
    try {
        //fetch the email from the body
        const {email} =req.body;

        //check wehter the user is alrady exist or not 
        const checkUserPresent = await  User.findOne({email});

        //if the  user is already present return 
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"user already present/ registered",
            });
        }

        //generate the otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated :" ,otp);

        //check the otp is unique or not
        let result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp});
        }
        const otpPayload={email , otp};

        //create opt entry in the db
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return the response succesfully 
        res.status(200).json({
            success:true,
            message:"OTP sent succefully",
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"error while generating the otp",
        });
        
    }
};




//signup
exports.signUP = async (req,res)=>{

    try {
           //fetch the data form the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        }=req.body;

        //validate the data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"Fill all the data",
            })
        }

        //match tthe both the passwords
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password and the confom password dose not matching ,plz try again later"
            });
        }
        //check the user is alredy exist or not
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(401).json({
                success: false,
                message:"user already exist",
            })
        }

        //find the most recent otp stored for the user
        const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOTP);

        //validate the otp
        if(recentOTP.length == 0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:"otp not found"
            })
        }else if(Number(otp) !== recentOTP[0].otp){
            return res.status(400).json({
                success:false,
                message:"invalid otp",
            });
        }

        //hash the password
        const hashpassword =await bcrypt.hash(password,10);

        //creaate the entry in the db
        const ProfileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
        const user =await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashpassword,
            accountType,
            additionalDetails:ProfileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });


        //return the responce
        return res.status(200).json({
            success:true,
            message:"user registerd successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"user cannot registerd plz try again later"
        });
        
    }
 

}

//login 

exports.login = async(req,res)=>{
    try {
        //get the data form the req body
        const {email , password}=req.body;

        //vlaidate the data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"plz enter all the details"
            });
        }

        //user is already exitst or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user cannot exist plz sign up first"
            });
        }

        //generate the JWA ,after the paswword matching
        
        if(await bcrypt.compare(String(password), String(user.password))){

            const payload = {
                email: user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload , process.env.JWT_SECRET,{
                expiresIn:"24h",
            });
            user.token =token;
            user.password=undefined;

            //create the cookie and send the responce
            const options ={
                expires:new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token", token , options).status(200).json({
                success:true,
                token,
                user,
                message:"Login successfully",
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'password incorrect',
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login failuer plz try again later"
        });
    }
};

//change the password 

exports.changePassword =async (req,res)=>{
  try {
    
    //get oldpsss ,newpss , consformpass,
     const {oldPassword , newPassword , confirmNewPassword} =req.body;
    //validate all the pass,
    if(!oldPassword || !newPassword  || !confirmNewPassword){
         
        return res.json({
            success:false,
            message:'plz enter all the passwords first',
        });
    }

    // get user
        const userDetails = await User.findById(req.user.id);
    //compare the old pass
    const isMatch = await bcrypt.compare(oldPassword,userDetails.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

    if(newPassword !== confirmNewPassword){
        return res.json({
            success:false,
            message:"newPassword and confirm password dose not matching",
        });
    }
    //hash the new pass
    const hashedPassword = await bcrypt.hash(newPassword ,10);
    //update the pass
    // update in DB
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
            { password: hashedPassword },
            { new: true });


      // send email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                'Password for your account has been updated',
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            // console.log("Email sent successfully:", emailResponse);
        }
        catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }
    //return response
    return res.status(200).json({
        success:true,
        message:"pass changed successfully",
    });
  } catch (err) {
       console.log(err);
        return res.status(500).json({
            success:false,
            message:"failed to change the password try again  later"
        });
  }
}

