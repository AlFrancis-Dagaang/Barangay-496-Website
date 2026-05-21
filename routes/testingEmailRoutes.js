const express = require('express');
const { sendEmail } = require('./sendMailer');
const router = express.Router();

router.get('/send-verification-email-me', async (req, res) => {
  try {
    const email = 'pikowo6301@ociun.com';
    const verificationLink = `http://localhost:3000/send-verification-to-anyone?token=unique-token`; 

    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Verify Your Email</title>
    </head>
    <body style="background-color: #ededed; height:500px; font-family: 'Poppins', sans-serif; padding: 50px 0px; margin: 0; box-sizing: border-box;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; text-align: center; border-radius: 10px; box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);">
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px;  margin: 0 auto; width: 170px;">
          <img src="https://i.imgur.com/opEaZAc.png" style="width: 50px; height: 50px;" />
          <p style="font-size: 16px; font-weight:500; margin-left: 10px;">Barangay 496</p>
        </div>
        <h2 style="font-size: 24px;">Verified Resident</h2>
        <h4 style="color: #a4a4a4; margin: 0 20px;">Congratulations! You are now a verified resident of Barangay 496. This status grants you access to a range of community services and benefits</h4>
        <p style="background-color: #f4ce74; color: rgb(32, 32, 32); padding: 10px 20px;font-size: 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 800; text-align: center; width: 80%; margin-top: 20px;"> Welcome to Barangay 496!</a>
      </div>
    </body>
    </html>
    `;

    await sendEmail(email, 'Email Verification', emailHtml);
    res.status(200).json({ message: 'Verification email sent successfully.' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/send-verification-to-anyone', (req, res) => {
  const { token } = req.query;
  console.log(`Verification token received: ${token}`);
  res.send('Email verification successful.');
});

module.exports = router; // Export the router
