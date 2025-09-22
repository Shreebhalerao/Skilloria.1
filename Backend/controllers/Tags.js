const Tag =require("../models/tags");


exports.createTag = async(req,res)=>{
    try {
        //fetch the data from the body
        const {name , description}= req.body;

        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"plz enter all the data",
            });
        }
        //create the entry in the db
        const tagDetails =await Tag.create({
            name:name,
            description:description,
        });

        console.log(tagDetails);

        //reutrn the responce 
        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
        })
        
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"unable to create the tag"
        })
        
    }
}

//find all the tags

exports.shoeAllTags=async (req,res)=>{
    try {
        const allTags =await Tag.find({}, {name:true ,description:true});
        res.status(200).json({
            success:true,
            message:"all tags return successfully",
            allTags,
        })
        
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"can not find the any tags",
        })
        
    }
}