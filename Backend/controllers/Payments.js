const Razorpay = require('razorpay');
const instance = require('../config/razorpay');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
const { paymentSuccessEmail } = require('../mail/templates/paymentSuccessEmail'); // Make sure this exists
require('dotenv').config();

const User = require('../models/User');
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const { default: mongoose } = require('mongoose');

// ================ Capture Payment & Create Razorpay Order ================
exports.capturePayment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) 
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const { coursesId } = req.body;
        if (!coursesId || !Array.isArray(coursesId) || coursesId.length === 0)
            return res.status(400).json({ success: false, message: "Please provide Course Ids" });

        let totalAmount = 0;

        for (const course_id of coursesId) {
            const course = await Course.findById(course_id);
            if (!course) 
                return res.status(404).json({ success: false, message: `Course not found: ${course_id}` });

            if (course.studentsEnrolled.includes(userId))
                return res.status(400).json({ success: false, message: `Student already enrolled in course: ${course.courseName}` });

            // Fix: use capital P and ensure numeric value
            totalAmount += Number(course.Price);
        }

        if (totalAmount <= 0)
            return res.status(400).json({ success: false, message: "Total amount must be greater than 0" });

        const options = {
            amount: totalAmount * 100, // in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const paymentResponse = await instance.instance.orders.create(options);

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order: paymentResponse,
        });

    } catch (error) {
        console.error("Capture Payment Error:", error);
        return res.status(500).json({ success: false, message: "Could not initiate payment" });
    }
};


// ================ Verify Payment ================
exports.verifyPayment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, coursesId } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !coursesId)
            return res.status(400).json({ success: false, message: "Payment Failed, data missing" });

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature)
            return res.status(400).json({ success: false, message: "Payment verification failed" });

        // Enroll student after successful payment
        await enrollStudents(coursesId, userId);

        return res.status(200).json({ success: true, message: "Payment verified and student enrolled" });
    } catch (error) {
        console.error("Verify Payment Error:", error);
        return res.status(500).json({ success: false, message: "Could not verify payment" });
    }
};

// ================ Enroll Students ================
const enrollStudents = async (coursesId, userId) => {
    for (const courseId of coursesId) {
        const enrolledCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { studentsEnrolled: userId } },
            { new: true }
        );

        if (!enrolledCourse) throw new Error(`Course not found: ${courseId}`);

        const courseProgress = await CourseProgress.create({
            courseID: courseId,
            userId,
            completedVideos: [],
        });

        const enrolledStudent = await User.findByIdAndUpdate(
            userId,
            { $push: { courses: courseId, courseProgress: courseProgress._id } },
            { new: true }
        );

        // Send email notification
        await mailSender(
            enrolledStudent.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName, enrolledStudent.firstName)
        );
    }
};

// ================ Send Payment Success Email ================
exports.sendPaymentSuccessEmail = async (req, res) => {
    try {
        const { orderId, paymentId, amount } = req.body;
        const userId = req.user?.id;
        if (!orderId || !paymentId || !amount || !userId)
            return res.status(400).json({ success: false, message: "Please provide all required fields" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        await mailSender(
            user.email,
            `Payment Received`,
            paymentSuccessEmail(user.firstName, amount / 100, orderId, paymentId)
        );

        return res.status(200).json({ success: true, message: "Payment success email sent" });
    } catch (error) {
        console.error("Send Payment Success Email Error:", error);
        return res.status(500).json({ success: false, message: "Could not send email" });
    }
};
