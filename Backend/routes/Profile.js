const express = require("express");
const router = express.Router();

const{UpdateProfile,deleteProfile,getUserDetails,instructorDashboard,updateUserProfileImage,updateProfile,getEnrolledCourses}=require("../controllers/Profile");
const{auth,isStudent,isInstructor,isAdmin}=require("../middlewares/auth");


//for the update profile
router.post("/UpdateProfile",auth,UpdateProfile);
//for the delete profieel
router.delete("/deleteProfile",auth,deleteProfile);
//for the user details
router.get("/getUserDetails",auth,getUserDetails);


 // Get Enrolled Courses
router.get('/getEnrolledCourses', auth, getEnrolledCourses);

// update profile image
router.put("/update-profile-image", auth, (req, res, next) => {
  next();
}, updateUserProfileImage);


// instructor Dashboard Details
router.get('/instructorDashboard', auth,isInstructor, instructorDashboard);
module.exports=router