const mongoose =require("mongoose");

const tagsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:Number,
    },
    Course:{
        type:mongoose.Schema.ObjectId,
        ref:"Course",  
    },
    
    
});

module.exports = mongoose.model("Tag",tagsSchema);