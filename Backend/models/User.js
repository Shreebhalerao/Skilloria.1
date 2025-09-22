const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // ensures no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["admin", "student", "instructor"],
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  approved: {
    type: Boolean,
    default: true,
  },
  additionalDetails: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  ],
  image: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    default: null, // always has a default
  },
  resetPasswordTokenExpires: {
    type: Date,
    default: null, // always has a default
  },
  courseProgress: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "CourseProgress",
    },
  ],
});

// Optional: clear token after password reset
userSchema.methods.clearResetToken = function () {
  this.resetPasswordToken = null;
  this.resetPasswordTokenExpires = null;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
