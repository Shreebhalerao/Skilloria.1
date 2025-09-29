const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 2525, // SSL port for Gmail
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: `"Shree || Shreeraj Dev" <${process.env.MAIL_USER}>`,
            to: email,
            subject: String(title),
            html: `<p>Your OTP is: <b>${String(body)}</b></p>`, // ensures it's a string
        });

        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (err) {
        console.error("❌ Email sending failed:", err.message);
    }
};

module.exports = mailSender;
