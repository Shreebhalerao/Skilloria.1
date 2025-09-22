const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");   // ✅ added missing import
const { uploadImageToCloudinary, deleteResourceFromCloudinary } = require("../utils/imageUploder");


// Update Profile
exports.UpdateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber = "", gender = "", firstName, lastName } = req.body;
    const id = req.user.id;

    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All the details are required",
      });
    }

    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    userDetails.firstName = firstName;
    userDetails.lastName = lastName;
    await userDetails.save();

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    profileDetails.about = about;
    await profileDetails.save();

    const updatedUser = await User.findById(id).populate("additionalDetails").exec();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Failed to update the profile",
    });
  }
};


// Delete Profile
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("id - ", userId);

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete the profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    // delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the profile",
    });
  }
};


// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("id - ", userId);

    const userDetails = await User.findById(userId).populate("additionalDetails").exec();

    return res.status(200).json({
      success: true,
      data: userDetails,
      message: "User data found successfully",
    });

  } catch (err) {
    console.log("Error while fetching user details", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Update Profile Image
exports.updateUserProfileImage = async (req, res) => {
  try {
    const profileImage = req.files?.profileImage;
    const userId = req.user?.id;

    console.log("req.user =", req.user);
    console.log("req.files =", req.files);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or token missing",
      });
    }

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile image file is required",
      });
    }

    const image = await uploadImageToCloudinary(profileImage, process.env.FOLDER_NAME, 1000, 1000);
    console.log("Cloudinary upload result =", image);

    if (!image?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    const updatedUserDetails = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    ).populate("additionalDetails");

    if (!updatedUserDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: updatedUserDetails,
    });

  } catch (error) {
    console.error("Error while updating user profile image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating profile image",
      error: error.message,
    });
  }
};


// Instructor Dashboard
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      // Handle both possible fields for enrolled students
      const enrolledStudents = course.studentsEnrolled || course.studentEnrolled || [];
      const totalStudentsEnrolled = enrolledStudents.length;
      console.log("totalStudentsEnrolled", totalStudentsEnrolled);

      const coursePrice = Number(course.Price || 0); // Ensure Price is a number
      const totalAmountGenerated = totalStudentsEnrolled * coursePrice;

      return {
        _id: course._id,
        courseName: course.courseName || "Untitled Course",
        courseDescription: course.courseDescription || "",
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
    });

    res.status(200).json({
      courses: courseData,
      message: "Instructor Dashboard Data fetched successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

function convertSecondsToDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


// Get Enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    userDetails = userDetails.toObject();

    let SubsectionLength = 0;
    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;

      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );

        userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
        SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length;
      }

      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });

      courseProgressCount = courseProgressCount?.completedVideos.length;

      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
