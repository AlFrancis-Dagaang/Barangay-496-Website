const express = require('express');
const router = express.Router();
const GmailOTP = require('./model/gmailAndOtp');
const UserMain = require('./model/userMainModel');
const FullUserInfo =  require('./model/userFullInformationModel');
const AdminMain = require('./model/adminMainModel');
const WaitListerAccount = require('./model/waitListerAccountModel');
const { sendEmail } = require('./sendMailer');


// GET route to render the front view
router.get('/', (req, res) => {
  res.render('front');
});

router.get('/about-us', (req, res) => {
  res.render('About-Us');
});
router.get('/contact-us', (req, res) => {
  res.render('Contact-Us');
});
router.get('/learn-more', (req, res) => {
  res.render('Learn-More');
});

// GET route to render the front_SignUp view
router.get('/register', (req, res) => {
  res.render('front_SignUp');
});

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

router.get('/home', async (req, res) => {
  try {
    // Retrieve email from session
    const email = req.session.email;

    // Check if email exists in the session
    if (!email) {
      // If email doesn't exist, redirect to login page or handle appropriately
      return res.redirect('/');
    }

    // Find user data based on email in UserMain model
    const userData = await UserMain.findOne({ email });

    // Check if user data exists
    if (!userData) {
      // If user data doesn't exist, handle appropriately (e.g., redirect to a different page or show an error message)
      return res.status(404).send('User data not found');
    }

    // Render user-home-page with user data
    res.render('user-home-page', { userData });
  } catch (error) {
    console.error('Error rendering user home page:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/check-existingEmail', async (req, res) => {
  const { email } = req.body;

  try {
      const existingEmail = await UserMain.findOne({ email });

      if (existingEmail!==null) {
          res.json({ exists: true });
      } else {
          res.json({ exists: false });
      }
  } catch (error) {
      console.error('Error checking email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/signup-waitlist', async (req, res) => {
  try {
    const { email, userName, password } = req.body; // Get data from the request body

    // Validate input
    if (!userName || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    if (!userName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newUserLister = new WaitListerAccount({
      userName: userName,
      password: password,
      email: email
    });
    
    await newUserLister.save();

    // Construct the verification link using the email as the token
    const verificationLink = `http://localhost:3000/register-email?token=${encodeURIComponent(email)}`; // Use the email as the token
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
        <h2 style="font-size: 24px;">Verify Your Email Address</h2>
        <h4 style="color: #a4a4a4; margin: 0 20px;">Please confirm that you want to use this as your user account email address. Once it's done you will be registered.</h4>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationLink}" class="verify-email" style="background-color: #f4ce74; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500; font-size: 16px; text-align: center; width: 80%; margin-top: 20px;">Verify My Email</a>
      </div>
    </body>
    </html>
    `;

    await sendEmail(email, 'Email Verification', emailHtml); // Send the verification email

    res.status(200).json({ message: 'Verification email sent successfully.' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/register-email', async (req, res) => {
  const { token } = req.query; // The token is the email address

  try {
    const account = await WaitListerAccount.findOne({ email: decodeURIComponent(token) });

    if (!account) {
      return res.status(404).json({ message: 'Your Account is already verified.' });
    }

    const newUserMain = new UserMain({
      userName: account.userName,
      password: account.password,
      email: account.email
    });

    const newUserFullInfo = new FullUserInfo({
      userName: account.userName,
      email: account.email
    });

    await newUserMain.save();
    await newUserFullInfo.save();
    await WaitListerAccount.deleteOne({ email: decodeURIComponent(token) });

    res.render('success-verification');
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Handling request when user register
router.post('/register', async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    
    // Validate input
    if (!userName || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    if (!userName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingEmail = await  UserMain.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    // Create new user

    const newUserMain = new UserMain({
      userName: userName,
      password: password,
      email: email
    });

    const newUserFullInfo = new FullUserInfo({
      userName: userName,
      email: email
    });

    await newUserMain.save();
    await newUserFullInfo.save();

    return res.status(200).json({ message: 'Successfully registered' })
  } catch (error) {

    if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
      // If the error is due to duplicate email, send a message to the client
      return res.status(401).send('An account with this email already exists');
    }
    console.error('Error registering user:', error);
    res.status(500).send('Internal server error');
  }
});

//Handling request when user log in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if the user exists in the SignUpAccount model
    const existingUser = await UserMain.findOne({ email, password });
    const existingAdmin = await AdminMain.findOne({ email, password });
    if (!existingUser && !existingAdmin) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    

    // Check if the user is an admin
    const isAdmin = await AdminMain.exists({ email });
    
    // Redirect based on userType
    if (isAdmin) {
      res.json({ userType: 'admin' });
    } else {
      req.session.email = email;
      res.json({ userType: 'resident' });
    }

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handling request when user submits email from forgot password
router.post('/send-verification-email', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email already exists in the SignUpAccount model
    const existingUser = await UserMain.findOne({ email });

    // If the email doesn't exist in the SignUpAccount model
    if (!existingUser) {
      return res.status(400).json({ error: 'The email is not registered yet' });
    }

    // Save the email in the session
    req.session.email = email;

    // Check if the email already exists in the database
    const existingGmailOTP = await GmailOTP.findOne({ email });

    // Generate a new OTP (4 digits)
    const generatedOTP = Math.floor(1000 + Math.random() * 9000);

    if (existingGmailOTP) {
      // If the email already exists, update the existing record with the new OTP
      existingGmailOTP.otp = generatedOTP.toString();
      await existingGmailOTP.save();
    } else {
      // If the email does not exist, create a new record with the generated OTP
      const newGmailOTP = new GmailOTP({ email, otp: generatedOTP.toString() });
      await newGmailOTP.save();
    }

    // Send OTP to the email
    await sendOTP(email, generatedOTP);

    res.status(200).json({ message: 'OTP sent successfully' });
    console.log(req.session.email+' is the main email');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to send OTP to the provided email
async function sendOTP(email, otp) {
  try {
    const subject = 'OTP for Password Reset';
    const html = `<!DOCTYPE html>
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
        <h2 style="font-size: 24px;">OTP for Password Reset</h2>
        <h4 style="color: #a4a4a4; margin: 0 20px;">Please confirm that you requested a password reset. Use the code below to reset your password:</h4>
        <p style="background-color: #f4ce74; color: rgb(32, 32, 32); letter-spacing: 2px; padding: 10px 20px;font-size: 50px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 800; text-align: center; width: 80%; margin-top: 20px;">${otp}</p>
      </div>
    </body>
    </html>
    `;
    
    // Send email using sendEmail function from sendMailer.js
    await sendEmail(email, subject, html);

    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
}

// Handling request to verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.session.email;
    // Find the GmailOTP document with the provided OTP
    const gmailOTP = await GmailOTP.findOne({ email, otp });

    if (!gmailOTP) {
      return res.status(404).json({ error: 'Invalid OTP' });
    }

    // You can perform additional operations here, like resetting the password or whatever your use case requires

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST route to handle submission of new password
router.post('/new-password', async (req, res) => {
  try {
      // Retrieve session email
      const email = req.session.email;

      // Check if session email exists
      if (!email) {
          return res.status(400).json({ error: 'Session email not found' });
      }

      // Retrieve new password and old password from request body
      const { newPassword, oldPassword } = req.body;

      // Check if new password exists
      if (!newPassword) {
          return res.status(400).json({ error: 'New password is required' });
      }

      // Find the existing account in SignUpAccount using the session email
      const existingAccountMain = await UserMain.findOne({ email });

      // Check if account with session email exists
      if (!existingAccountMain) {
          return res.status(404).json({ error: 'Account not found' });
      }

      // Check if the old password matches the existing password
      if (existingAccountMain.password !== oldPassword) {
          return res.status(401).json({ error: 'Old password is incorrect' });
      }

      // Check if the new password is the same as the existing password
      if (existingAccountMain.password === newPassword) {
          return res.status(402).json({ error: 'New password must be different from the current password' });
      }

      // Update the password for the existing account
      existingAccountMain.password = newPassword;
      await existingAccountMain.save();

      const responseData = {
          message: 'Password updated successfully',
          userName: existingAccountMain.userName
      };

      // Send the response with the updated data
      res.status(200).json(responseData);
  } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
      // Retrieve session email
      const email = req.session.email;

      // Check if session email exists
      if (!email) {
          return res.status(400).json({ error: 'Session email not found' });
      }

      // Retrieve new password from request body
      const { password } = req.body;

      // Check if new password exists
      if (!password) {
          return res.status(400).json({ error: 'New password is required' });
      }

      // Find the existing account in SignUpAccount using the session email
      const existingAccountMain = await UserMain.findOne({ email });

      // Check if account with session email exists
      if (!existingAccountMain) {
          return res.status(404).json({ error: 'Account not found' });
      }

      // Check if the new password is the same as the existing password
      if (existingAccountMain.password === password) {
        return res.status(400).json({ error: 'New password must be different from the current password' });
    }

      // Update the password for the existing account
      existingAccountMain.password = password;
      await existingAccountMain.save();

      const responseData = {
        message: 'Password updated successfully',
        userName: existingAccountMain.userName
    };

    // Send the response with the updated data
    res.status(200).json(responseData);
  } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;

