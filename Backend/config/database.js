const mongoose =require("mongoose");
require("dotenv").config();


exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log("DB connected succesfully "))
    .catch((err)=>{
        console.log("db connection failed");
        console.log(err);
        process.exit(1);
    })
}