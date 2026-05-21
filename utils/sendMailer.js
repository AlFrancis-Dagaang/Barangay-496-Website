
const nodemailer = require('nodemailer');
const path = require('path');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'dagaang.alfrancis@gmail.com',
    pass: '',
  },
});

// Function to send email
async function sendEmail(to, subject, html, attachments) {
  try {
    // Email content
    const mailOptions = {
      from: 'dagaang.alfrancis@gmail.com',
      to,
      subject,
      html,
      attachments,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports.sendEmail = sendEmail;
