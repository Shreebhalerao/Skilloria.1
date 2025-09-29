const fetch = require("node-fetch"); // make sure node-fetch is installed: npm i node-fetch

const mailSender = async (email, title, body) => {
    try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY, // your Brevo API key
            },
            body: JSON.stringify({
                sender: {
                    name: "Shree || Shreeraj Dev",
                    email: process.env.MAIL_USER // your verified sender email
                },
                to: [
                    { email: email }
                ],
                subject: title,
                htmlContent: `<p>Your OTP is: <b>${body}</b></p>`
            }),
        });

        const data = await res.json();
        console.log("✅ Email sent via Brevo API:", data);
        return data;

    } catch (err) {
        console.error("❌ Email sending failed via Brevo API:", err.message);
    }
};

module.exports = mailSender;