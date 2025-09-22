// controllers/courseController.js

const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Category = require("../models/Category");
const { uploadImageToCloudinary, deleteResourceFromCloudinary } = require("../utils/imageUploder");
const CourseProgress = require("../models/CourseProgress");

// ================= Create Course =================
exports.createCourse = async (req, res) => {
  console.log("Incoming request body:", req.body);

  try {
    let { title, description, price, category, instructions, status, tags, whatYouWillLearn } =
      req.body;

    const courseName = title;
    const courseDescription = description;
    const Price = Number(price);

    // Parse arrays safely
    try {
      tags = tags ? JSON.parse(tags) : [];
      instructions = instructions ? JSON.parse(instructions) : [];
      whatYouWillLearn = whatYouWillLearn ? JSON.parse(whatYouWillLearn) : [];
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format for tags, instructions, or whatYouWillLearn",
      });
    }

    // File check (thumbnail)
    if (!req.files || !req.files.thumbnailImage) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }
    const thumbnail = req.files.thumbnailImage;

    // Validation
    if (
      !courseName ||
      !courseDescription ||
      !Price ||
      !category ||
      !thumbnail ||
      !whatYouWillLearn?.length ||
      !instructions?.length ||
      !tags?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Get instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details:", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // Upload thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

    // Create new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      Price,
      tag: tags,
      thumbnail: thumbnailImage.secure_url,
      createdAt: Date.now(),
      category,
      status,
      instructions,
    });

    // Add course to instructor
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Add course to category
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (err) {
    console.error("Error while creating course:", err);
    return res.status(500).json({
      success: false,
      message: "Error while creating the course",
      error: err.message,
    });
  }
};

// ================= Get All Courses =================
exports.getALLCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        Price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate({
        path: "instructor",
        select: "firstName lastName email image",
      })
      .exec();

    return res.status(200).json({
      Data: allCourses,
      success: true,
      message: "All the courses fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching all the courses",
    });
  }
};

// ================= Get Course Details =================
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDetails = await Course.find({ _id: courseId })
      .populate({ path: "instructor" })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      courseDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while fetching the coursesDetails",
    });
  }
};

// ================= Edit Course =================
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (req.files && req.files.thumbnailImage) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
      course.thumbnail = thumbnailImage.secure_url;
    }

    for (const key of Object.keys(req.body)) {
      let value = req.body[key];
      if (["tags", "instructions", "whatYouWillLearn"].includes(key)) {
        try {
          value = typeof value === "string" ? JSON.parse(value) : value;
        } catch (err) {
          return res
            .status(400)
            .json({ success: false, message: `${key} must be a valid JSON array` });
        }
        if (Array.isArray(value)) value = value.flat(Infinity);
      }
      course[key] = value;
    }

    course.updatedAt = Date.now();
    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("EDIT_COURSE_API_ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error while updating course",
      error: error.message,
    });
  }
};

// ================= Get Instructor Courses =================
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const instructorCourses = await Course.find({ instructor: instructorId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: instructorCourses,
      message: "Courses made by Instructor fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

// ================= Delete Course =================
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const studentsEnrolled = course.studentsEnrolled || [];
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    if (course.thumbnail) {
      await deleteResourceFromCloudinary(course.thumbnail);
    }

    const courseSections = course.courseContent || [];
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection || [];
        for (const subSectionId of subSections) {
          const subSection = await SubSection.findById(subSectionId);
          if (subSection && subSection.videoUrl) {
            await deleteResourceFromCloudinary(subSection.videoUrl);
          }
          await SubSection.findByIdAndDelete(subSectionId);
        }
        await Section.findByIdAndDelete(sectionId);
      }
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting course",
      error: error.message,
    });
  }
};

// ================= Get Full Course Details =================
const convertSecondsToDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let durationStr = "";
  if (hours > 0) durationStr += `${hours}h `;
  if (minutes > 0) durationStr += `${minutes}m `;
  durationStr += `${seconds}s`;

  return durationStr.trim();
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.id;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }

    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    if (!courseDetails) {
      return res
        .status(404)
        .json({ success: false, message: `Could not find course with id: ${courseId}` });
    }

    const courseProgressCount = await CourseProgress.findOne({ courseID: courseId, userId });

    let totalDurationInSeconds = 0;
    (courseDetails.courseContent || []).forEach((content) => {
      (content.subSection || []).forEach((subSection) => {
        totalDurationInSeconds += parseInt(subSection.timeDuration) || 0;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos || [],
      },
    });
  } catch (error) {
    console.error("COURSE_FULL_DETAILS_API ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
