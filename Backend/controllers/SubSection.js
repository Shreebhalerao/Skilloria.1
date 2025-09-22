const Section= require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploder");

//create subsection

exports.createSubSection =async (req,res)=>{
    try {
        //fetch the data from the req body
        const {sectionId ,title ,description}=req.body;
        //extract file / video
        const video = req.files.videoFile;
        console.log(sectionId ,title ,description)
        console.log("video---------",video)
        //validation 
        if(!sectionId || !title  || !description  || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are requrired"
            });
        }
        //uplode video to the cloudninary
        const uplodeDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);

        //create the subsection
        const subSectionDetails = await SubSection.create({title:title,description:description,videoUrl:uplodeDetails.secure_url,})

        //update section with this sub section objectctId
        const updatedSection =await Section.findByIdAndUpdate({_id:sectionId},{$push:{subSection:subSectionDetails._id}},{new:true}).populate("subSection");

        //hw:log updated section hrere after the populate query

        //reutrn thr responce 
        return res.status(200).json({
        success:true,
        message:"SubSection created succesfully",
        updatedSection,
       });
    } catch (err) {
        console.log(err);
         return res.status(500).json({
            success:false,
            message:"Unable to create  the Subsection",
            err:err.message,
        });
    }    
}

//updatesubsection
exports.updatedSubSection =async (req,res)=>{
    try {
        //fetch the data from the body
        const {SubSectionID}=req.params;
        const {title,timeDuration ,description}=req.body;

         //validation 
         if(!SubSectionID){
            return res.status(401).json({
                success:false,
                message:"SubSection dose not found",
            });
         }
        if(!title || !timeDuration || !description  || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are requrired"
            });
        }
        //update the SubSction 
        const updatedSubSection = await SubSection.findByIdAndUpdate({SubSectionID},{title:title,timeDuration:timeDuration,description:description,},{new:true});

        //reutrn the response
        return res.status(200).json({
            success:true,
            message:"Subsection is updates succsfully",
        });

        
    } catch (err) {
         return res.status(500).json({
            success:false,
            message:"Unable to create  the Subsection",
            err:err.message,
        });
    }
}


//delete the section 
  exports.deleteSubSection = async (req, res) => {
  try {
    const { SubSectionID } = req.body;   // 👈 from body
    if (!SubSectionID) {
      return res.status(400).json({ success: false, message: "SubSectionID missing" });
    }

    await SubSection.findByIdAndDelete(SubSectionID);

    return res.status(200).json({ success: true, message: "SubSection deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Unable to delete SubSection", error: err.message });
  }
};