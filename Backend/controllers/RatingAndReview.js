const RatingAndReview =require("../models/RatingAndReview");
const Course =require("../models/Course");
const { default: mongoose } = require("mongoose");

//create ratings
exports.createRating=async(req,res)=>{
    try {
        //get user id
        const userId=req.user.id;
        //fetch the data from the req body
        const{rating, review ,courseId}=req.body;
        //check if the user is enrolled or not
        const courseDetails =await Course.findOne(
            {
                _id:courseId,
                studentEnrolled:{$elemMatch:{$eq:userId}},
            }
        );
         if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"student is not enrolles in the course",
            });
        }
        //check if already reviwed or not
        const alreadyReviewed =await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });

         if(!alreadyReviewed){
            return res.status(404).json({
                success:false,
                message:"course is already reviewed  by user",
            });

        }

        //create the rating and review
        const ratingAndReview = await RatingAndReview.create({
            rating,review,course:courseId,user:userId,
        });

        //update the course with this reting and review
        await Course.findByIdAndUpdate({_id:courseId},{
            $push:{ratingAndReviews:ratingAndReview}
        },{new:true},);
        //retun the response
        return res.status(200).json({
            success:true,
            message:"rating and reviews created successfully",
            ratingAndReview,
            
        });
    } catch (err) {
        console.log(err);
          return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}


//get average rating
exports.getAverageRating=async(req,res)=>{
    try {
        //get couse id
        const courseId=req.body.courseId;
        //calculate the average
        const result = await RatingAndReview.aggregate([
            {
                $match:{course:new mongoose.Types.ObjectId(courseId),}
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])
        //retun the res
        if(result.length>0){
            return res.status(200).json({
            success:true,
            message:result[0].averageRating,
            });
        }
        //if there is no rating
         return res.status(200).json({
            success:true,
            message:"avrage rating id 0, no rating till now",
            averageRating:0,
            });
    } catch (err) {
         console.log(err);
          return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

//get all rating and reviews

exports.getAllrating=async(req,res)=>{
    try {
        const allreviws =await RatingAndReview.find({})
            .sort({rating:"desc"})
            .populate({
                path:"user",
                select:"firstName lastName email image",
            })
            .populate({
                path:"course",
                select:"courseName",
            })
            .exec();
       
            
        
        return res.status(200).json({
            success:true,
            message:"all review fetch succsfully",
            data:allreviws,
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}


