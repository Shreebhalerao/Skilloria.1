const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Generate and send password reset token
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user, please check the email",
      });
    }

    // Generate token
    const token = crypto.randomUUID();
    console.log("Generated token:", token);

    // Save token and expiry in DB
    user.resetPasswordToken = token; // <-- corrected field
    user.resetPasswordTokenExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();
    console.log("Saved user:", user);

    // Send mail with reset link
    const url = `http://localhost:2000/api/update-password/${token}`;
    await mailSender(
      email,
      "Password Reset Link",
      `Click here to reset your password: ${url}`
    );

    return res.status(200).json({
      success: true,
      message: "Email sent successfully. Please check your inbox to reset your password",
    });
  } catch (err) {
    console.error("resetPasswordToken Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password mail",
    });
  }
};

// Reset the password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    console.log("REQ BODY:", req.body);

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // Find user by resetPasswordToken
    const user = await User.findOne({ resetPasswordToken: token });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (user.resetPasswordTokenExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token expired. Please regenerate link",
      });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("ResetPassword Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
};
