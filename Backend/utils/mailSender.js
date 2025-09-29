const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,   // Brevo SMTP host
            port: 587,                     // TLS port
            secure: false,                 // false for TLS
            auth: {
                user: process.env.MAIL_USER,  // Brevo login / verified sender
                pass: process.env.MAIL_PASS,  // Brevo SMTP key
            },
        });

        let info = await transporter.sendMail({
            from: `"Shree || Shreeraj Dev" <${process.env.MAIL_USER}>`, 
            to: email,
            subject: String(title),
            html: `<p>Your OTP is: <b>${String(body)}</b></p>`, // OTP message
        });

        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (err) {
        console.error("❌ Email sending failed:", err.message);
    }
};

module.exports = mailSender;
