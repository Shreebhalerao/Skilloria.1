const Section = require("../models/Section");
const Course =require("../models/Course");


exports.createSection = async(req,res)=>{
    try {
       //fetch the data

       const {sectionName , courseId}= req.body;
       //data validation 
       if(!sectionName || !courseId){
        return res.json({
            success:false,
            message:"all fields are mandetory"
        });
       }
       //create the section
       const newSection = await Section.create({sectionName})
       //updatee the course with section object id

       const updateCourse = await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id,}},{new:true},)  .populate({
                                                         path: "courseContent",
                                                         populate: { path: "subSection" },
                                                      })
                                                     .exec();
       //Hw use populate to repalce section/sbu-sections both in the updateCourseDetails
       
       //return the response 
       return res.status(200).json({
        success:true,
        message:"Section created succesfully",
        updateCourse,
       });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Unable to create the section",
            err:err.message,
        });
        
    }
}

//update the section 

 exports.updateSection = async(req,res)=>{
    try {
        //data input
        const {sectionName , sectionID}=req.body;
        //data validation 
         if(!sectionName || !sectionID){
        return res.json({
            success:false,
            message:"all fields are mandetory"
        });
       }
        //update data
        const section = await Section.findByIdAndUpdate(sectionID , {sectionName}, {new:true});     
         //return the responce
        return res.status(200).json({
        data:section,
        success:true,
        message:"Section updated succesfully"
       })

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Unable to update the section",
            err:err.message,
        });
    }
 }

//delete the section

exports.deleteSection = async(req,res)=>{
    try {
        //fetch the data
        const{sectionID}=req.body;

        //validate the data 
         if( !sectionID){
        return res.json({
            success:false,
            message:"all fields are mandetory"
        });
       }
        //delete section 
        const section = await Section.findByIdAndDelete(sectionID, {new:true},);//this {new:true is not added by the babbar}

        //return the responce
        return res.status(200).json({
        success:true,
        message:"Section deleted succesfully"
       })

    } catch (err) {
         return res.status(500).json({
            success:false,
            message:"Unable to delete the section",
            err:err.message,
        });
    }
}