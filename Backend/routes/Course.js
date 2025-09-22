const express = require("express");
const router = express.Router();


const{createCourse,getALLCourses,getCourseDetails ,getFullCourseDetails,editCourse,deleteCourse,getInstructorCourses}=require("../controllers/Course");
const{createCategory,showAllCategories,categoryPageDetails}=require("../controllers/category");
const{createSection,updateSection,deleteSection}=require("../controllers/Section");
const{createSubSection,updatedSubSection,deleteSubSection}=require("../controllers/SubSection");
const{createTag,shoeAllTags}=require("../controllers/Tags");
const{createRating,getAverageRating,getAllrating}=require("../controllers/RatingAndReview");
const{auth,isStudent,isInstructor,isAdmin}=require("../middlewares/auth");


//route to create the course 
router.post("/createCourse" ,auth ,isInstructor,createCourse);

//route to  get  the all course
router.get("/getALLCourses",getALLCourses);

//route to create the course details
router.post("/getCourseDetails",getCourseDetails);





//to create the category
router.post("/createCategory",auth,isInstructor,createCategory);

//to get aall the category
router.get("/showAllCategories",showAllCategories);

//to get the category page details
router.post("/categoryPageDetails", categoryPageDetails);

router.post('/getFullCourseDetails', auth, getFullCourseDetails);

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);





//to create the section
router.post("/createSection",auth ,isInstructor,createSection);

//to update the section
router.post("/updateSection",auth ,isInstructor,updateSection);
//to delete the section
router.delete("/deleteSection",auth ,isInstructor, deleteSection);

router.put("/editCourse", auth, isInstructor,editCourse);
router.delete("/deleteCourse", auth, isInstructor,deleteCourse);
 



//to create the subsection
router.post("/createSubSection",auth ,isInstructor,createSubSection);

//to update the dubsection
router.post("/updatedSubSection",auth ,isInstructor,updatedSubSection);
//to delete the subsection
router.delete("/deleteSubSection",auth ,isInstructor,deleteSubSection);



//to create the tags
router.post("/createTag",auth,isAdmin,createTag);
//to show thw all tags
router.get("/shoeAllTags",shoeAllTags);

//rating and reviws
router.post("/createRating",auth,isStudent,createRating);
router.get("/getAverageRating",getAverageRating);
router.get("/getAllrating",getAllrating);


module.exports=router