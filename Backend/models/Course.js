const mongoose =require("mongoose");

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
    ,
    whatYouWillLearn:{
        type:[String],
    },
    courseContent:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        }
    ],
    ratingAndReviews:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
        }
    ],
    Price:{
        type:[String],
        required: true
    },
    thumbnail:{
        type:String,
    },
    tag:{
        //type:mongoose.Schema.ObjectId,
        type:[String],
       // ref:"Tag",
       required:true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    instructions:{
        type:[String],

    },
    status:{
        type:String,
        enum:["Draft", "Published"],
    }
});

// module.exports = mongoose.model("Course",courseSchema);

module.exports = mongoose.connection.models.Course 
  || mongoose.model("Course", courseSchema);
