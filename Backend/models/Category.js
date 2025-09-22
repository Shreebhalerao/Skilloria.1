const mongoose = require("mongoose");


//define the schemmha 
const  categorySchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    description:{
        type:String,
    },
    courses:[{
        type:mongoose.Schema.ObjectId,
        ref:"Course",
    },],
});

module.exports = mongoose.model("Category", categorySchema);