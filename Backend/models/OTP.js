const mongoose =require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
        require:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,  
    }
});

//funcrion to send the email

async function sendVerificationEmail(email , otp) {
    try {
        const mailResponce = await mailSender(email , "verification email form shree" , otp);
        console.log("Email send succesfully" , mailResponce);
    } catch (err) {
        console.log("error occured whlie sending the mail" ,err);
        throw err;        
    }
    
}

OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email , this.otp);
    next();
    
})

module.exports = mongoose.model("OTP",OTPSchema);