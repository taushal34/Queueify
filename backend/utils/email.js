// const nodemailer = require("nodemailer");

// const sendSessionNotification = async (email, sessionTime) => {
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER, // Your email
//             pass: process.env.EMAIL_PASS, // Your email password
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "Session Notification",
//         text: `Your session is scheduled to start at ${sessionTime}. Please be ready.`,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${email}`);
//     } catch (err) {
//         console.error(`Failed to send email to ${email}: ${err.message}`);
//     }
// };

// module.exports = { sendSessionNotification };
// //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzE1NDhiMWZlYTYyYTgyZGEyZWY2MiIsImlhdCI6MTc1NzUwMDU1NSwiZXhwIjoxNzY1Mjc2NTU1fQ.uqV8ohopDL4kBc9hDkFIQnzn2yAQGcWvWoamxWgxSy0
// id=68c1548b1fea62a82da2ef62