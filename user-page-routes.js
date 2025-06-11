const express = require('express');
const router = express.Router();
const UserMain = require('./model/userMainModel');
const Verification = require('./model/verificationFormModel');
const UserServiceData = require('./model/userServiceModel');
const UserAppointment = require('./model/userAppointmentModel');
const UserComplaints = require('./model/userComplaintModel');
const UserMessages = require('./model/userMessagesModel');
const FullUserInfo =  require('./model/userFullInformationModel');
const { sendEmail } = require('./sendMailer');

// Route to fetch user profile data
router.get('/fetch-profile-data', async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session.email) {
            return res.status(401).json({ error: 'User is not authenticated' });
        }

        // Fetch user profile data from the UserMain collection based on session email
        const userData = await UserMain.findOne({ email: req.session.email });
        if (!userData) {
            return res.status(404).json({ error: 'User data not found' });
        }

        // Send user profile data back to the client
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user profile data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/check-email', async (req, res) => {
    const { email } = req.body;
    try {
        const existingEmail = await UserMain.findOne({ email });
        res.json({ exists: !!existingEmail });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/update-profile', async (req, res) => {
    const { profileImage, username, email } = req.body;

    const profileImageSrc = profileImage ? "/images/" + profileImage : null;

    try {
        // Find the user based on the session email
        const userMain = await UserMain.findOne({ email: req.session.email });
        const fullUserInfo = await FullUserInfo.findOne({ email: req.session.email });

        // Check if both user exist
        if (!userMain) {
            return res.status(404).json({ error: 'User not found' });
        }

          if(email){
            const tokenData = {
              newEmail: email,
              userEmail: req.session.email // Assuming username is another variable you want to include
          };

            const serializedTokenData = JSON.stringify(tokenData); // Serialize the data into a string
            const encodedToken = encodeURIComponent(serializedTokenData); // Encode the serialized data



          const verificationLink = `http://localhost:3000/change-email?token=${encodeURIComponent(encodedToken)}`; // Use the email as the token
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
              <h4 style="color: #a4a4a4; margin: 0 20px;">Please confirm that you want to use this as your user account email address.</h4>
              <p>Click the button below to verify your email:</p>
              <a href="${verificationLink}" class="verify-email" style="background-color: #f4ce74; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500; font-size: 16px; text-align: center; width: 80%; margin-top: 20px;">Verify My Email</a>
            </div>
          </body>
          </html>
          `;
      
          await sendEmail(email, 'Email Verification', emailHtml); // Send the verification email
        }
  
        // Update the user's profile with the provided data
        if (username) {
            userMain.userName = username;
            fullUserInfo.userName = username;
        }

        if (profileImageSrc) {
            userMain.profileImage = profileImageSrc;
        }

        await userMain.save();
        await fullUserInfo.save();

        if(!email){
          res.status(200).json({ message: 'usernameOrProfile' });
          console.log("usernameOrProfile");
        }else{
          res.status(200).json({ message: 'withEmail' });
          console.log("withEmail");
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/change-email', async (req, res) => {
  const { token } = req.query; // The token is the email address

  try {
    const decodedTokenData = JSON.parse(decodeURIComponent(token));
    const { newEmail, userEmail } = decodedTokenData;

    console.log(newEmail);

    const userMain = await UserMain.findOne({ email:userEmail });

    if (!userMain) {
      return res.status(404).json({ message: 'Your email is already verified.' });
    }
    
    const userVerification = await Verification.findOne({ email:userEmail });
    const userRequest = await UserServiceData.findOne({ email:userEmail });
    const userAppointment = await UserAppointment.findOne({ email:userEmail });
    const userFullInfo = await FullUserInfo.findOne({ email:userEmail });
    const userComplaints = await UserComplaints.findOne({ email:userEmail });

    
    if(userComplaints){
      userComplaints.email= newEmail;
      await userComplaints.save();
    }
    if(userFullInfo){
      userFullInfo.email= newEmail;
      await userFullInfo.save();
    }
    if(userAppointment){
      userAppointment.email= newEmail;
      await userAppointment.save();
    }
    if(userRequest){
      userRequest.email= newEmail;
      await userRequest.save();
    }
    if(userVerification){
      userVerification.email= newEmail;
      await userVerification.save();
    }
    if(userMain){
      userMain.email= newEmail;
      await userMain.save();
    }
    req.session.email = newEmail;
    res.render('success-verification');
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.post('/logout', (req, res) => {
    // Here you would perform the logout action
    // For example, you might destroy the session to log the user out
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ error: 'Error logging out. Please try again.' });
        } else {
            res.sendStatus(200); // Send success response if the logout is successful
        }
    });
});

router.get('/check-verification', async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session.email) {
            return res.status(401).json({ error: 'User is not authenticated' });
        }

        // Fetch user profile data from the UserMain collection based on session email
        const userData = await UserMain.findOne({ email: req.session.email });
        if (!userData) {
            return res.status(404).json({ error: 'User data not found' });
        }

        // Check if the user's email is verified
        const isVerified = userData.status || 'notVerified';
        res.status(200).json({ verified: isVerified });
    } catch (error) {
        console.error('Error checking verification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/send-verification-form', async (req, res) => {
    const { fullName, birthdate, sex, email, address, fileName } = req.body;

    const id = "/images/"+fileName;

    try {
        // Create a new verification document
        const verification = new Verification({
            fullName,
            birthdate,
            sex,
            email,
            address,
            id
        });

        // Save the verification document to the database
        await verification.save();

        console.log('Verification data saved successfully:', verification);
        await UserMain.updateOne({ email }, { status: "pending" });

        console.log('UserMain model updated successfully.');
        // Respond with a success message
        res.status(200).json({ message: 'Form submitted successfully' });

    } catch (error) {
        console.log('Error saving verification data:', error);
        // Respond with an error message
        res.status(500).json({ error: 'An error occurred while saving verification data' });
    }
});

router.post('/submitServiceData', async (req, res) => {
    try {
        const { selectedValue, email, information } = req.body;


        // Check if the email already exists in the collection
        let user = await UserServiceData.findOne({ email });

        // If the user doesn't exist, create a new document
        if (!user) {
            user = new UserServiceData({ email });
        }

        // Generate a random ID of 8 characters
        const id = generateRandomId();

        // Set the status to 'pending'
        const status = 'Pending';

        // Retrieve individual properties from the information object
        const { name, number, quantity, purpose } = information;

        // Construct the request object
        const newRequest = {
            name,
            number,
            quantity,
            purpose,
            id,
            status
        };

        // Push the new request into the appropriate array based on selectedValue
        switch (selectedValue) {
            case 'Barangay Clearance':
                user.Type_of_request.Clearance.push(newRequest);
                break;
            case 'Barangay Certificate':
                user.Type_of_request.Certificate.push(newRequest);
                break;
            case 'Barangay Indigency':
                user.Type_of_request.Indigency.push(newRequest);
                break;
            case 'Business Certificate':
                user.Type_of_request.Business.push(newRequest);
                break;
            default:
                return res.status(400).json({ message: 'Invalid request type' });
        }

        // Save the updated document
        await user.save();
        console.log('User Service data saved successfully:', user);

        res.status(200).json({ message: 'Data submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

  
// Function to generate a random ID of 8 characters
function generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < 8; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
}


router.post('/validate-appointment-code', async (req, res) => {
    const { appointmentCode } = req.body;

  
    try {
      const userWithCode = await UserAppointment.findOne({
        'appointments.appointmentCode': appointmentCode,
      });
  
      if (!userWithCode) {
        return res.status(404).json({ status: 'code-not-found', message: 'Code not found in any appointment.' });
      }
  
      const matchingAppointment = userWithCode.appointments.find((appt) => appt.appointmentCode === appointmentCode);


      if (!matchingAppointment) {
        return res.status(404).json({ status: 'code-not-found', message: 'Matching appointment not found.' });
      }

      if (matchingAppointment.dateOfAppointment) {
        return res.status(400).json({ status: 'code-in-use', message: 'Appointment code is already used.' });
      }
      //Appointment for Document Request
        if (['Clearance', 'Indigency', 'Certificate', 'Business'].includes(matchingAppointment.appointmentType)) {

                    // Find the UserServiceData for the corresponding email
            const userServiceData = await UserServiceData.findOne({ email: userWithCode.email });

        
            if (!userServiceData) {
                return res.status(404).json({ status: 'user-data-not-found', message: 'User service data not found.' });
            }
        
            const requestTypeArray = userServiceData.Type_of_request[matchingAppointment.appointmentType];
        
            const matchingRequest = requestTypeArray.find((req) => req.id === matchingAppointment.id);


            if (matchingRequest.status !== "Pending" && matchingRequest.status !== "Approved") {
                
                return res.status(403).json({ status: 'code-in-use', message: 'Appointment code cannot be used anymore.' });
              }

        
            if (!matchingRequest) {
                return res.status(404).json({ status: 'request-not-found', message: 'Matching request not found.' });
            }
        
            // If everything is okay, return a successful response
            return res.status(200).json({ status: 'code-valid', matchingAppointment, matchingRequest });
        }else if(matchingAppointment.appointmentType==="Clearance"){

        }
  
    } catch (error) {
      console.error('Error verifying appointment code:', error);
      return res.status(500).json({ status: 'server-error', message: 'An internal server error occurred.' });
    }
  });

  router.post('/set-appointment-date', async (req, res) => {
    const { appointmentCode, selectedDate } = req.body;
    
    const email = req.session.email; 


    try {
      // Find the user with the matching appointment code
      const userWithCode = await UserAppointment.findOne({
        'appointments.appointmentCode': appointmentCode,
      });
  
      if (!userWithCode) {
        return res.status(404).json({ message: 'Appointment code not found' }); // If the code doesn't exist, return a 404 response
      }
  
      // Find the specific appointment within the user's appointments
      const matchingAppointment = userWithCode.appointments.find((appt) => appt.appointmentCode === appointmentCode);
  
      if (!matchingAppointment) {
        return res.status(404).json({ message: 'Appointment not found' }); // If no matching appointment is found, return a 404 response
      }
  
      // Update the date of the appointment with the selected date
      matchingAppointment.dateOfAppointment = new Date(selectedDate);
      
      const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const formattedDate = formatter.format(new Date(selectedDate));
      
      
      // Assign the selected date to the appointment
      matchingAppointment.status = "Pending";
      // Save the updated user appointment document
      await userWithCode.save(); // Save the changes to the document


        if (['Clearance', 'Indigency', 'Certificate', 'Business'].includes(matchingAppointment.appointmentType)) {

                // Find the UserServiceData based on the user's email
            const userServiceData = await UserServiceData.findOne({ email: userWithCode.email });
        
            if (!userServiceData) {
                return res.status(404).json({ message: 'UserServiceData not found' }); // If user service data is not found, return a 404 response
            }
        
            // Find the object in UserServiceData.Type_of_request that matches the appointment ID
            const requestTypeArray = userServiceData.Type_of_request[matchingAppointment.appointmentType];
            const matchingRequest = requestTypeArray.find((req) => req.id === matchingAppointment.id);
        
            if (!matchingRequest) {
                return res.status(404).json({ message: 'Matching request not found' }); // If no matching request is found, return a 404 response
            }
        
            // Update the status to "Process"
            matchingRequest.status = 'Processing'; // Set the status to "Process"

            const emailHtml = `
            <!DOCTYPE html>
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
                <h2 style="font-size: 24px;">Appointment Confirmation!</h2>
                <h4 style="color: #a4a4a4; margin: 0 20px;">
                Your successfully set your appointment date on ${formattedDate} </h4>
              </div>
            </body>
            </html>
            `;

            await sendEmail(email, `Appointment Confirmation`, emailHtml);

            await userServiceData.save(); // Save the changes to UserServiceData
        
            // Return a successful response if everything is set
            res.status(200).json({ message: 'Appointment date set successfully' });

      }else if(matchingAppointment.appointmentType ==="Complaint"){

      }

    } catch (error) {
      console.error('Error setting appointment date:', error);
      res.status(500).json({ message: 'An error occurred while setting the appointment date' });
    }
  });

  router.post('/submit-complaint', async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        category,
        description,
      } = req.body;
  
      // Validate that all required fields are provided
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phoneNumber ||
        !category ||
        !description
      ) {
        return res
          .status(400)
          .json({ message: 'Please fill in all required fields.' });
      }
  
      // Find the user complaint data by email
      let userComplaintData = await UserComplaints.findOne({ email });
  
      // If the user doesn't have existing data, create a new document
      if (!userComplaintData) {
        userComplaintData = new UserComplaints({ email });
      }
  
      // Generate a unique ID for this complaint
      const complaintId = require('crypto').randomBytes(4).toString('hex');
  
      // Create a new complaint information object
      const newComplaint = {
        firstName,
        lastName,
        phoneNumber,
        category,
        serviceType: 'Complaint', // You can customize this based on your requirement
        description,
        id: complaintId,
        status: 'Pending', // Default status
        dateOfComplaint: new Date(), // Current date
      };
  
      // Add the new complaint to the complaint_information array
      userComplaintData.complaint_information.push(newComplaint);
  
      // Save the updated document
      await userComplaintData.save();
  
      res.status(200).json({
        message: 'Complaint submitted successfully',
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      res
        .status(500)
        .json({ message: 'Internal server error occurred while submitting complaint' });
    }
  });

  router.post('/submit-contact-form', async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      // Validate that none of the fields are empty
      if (!name || !email || !message) {
        return res.status(400).json({
          error: 'All fields are required.',
        });
      }

      const id = require('crypto').randomBytes(4).toString('hex');
  
      // Create a new message and save it to the database
      const newMessage = new UserMessages({
        name,
        email,
        message,
        id
      });
  
      await newMessage.save(); // Save the message to the database
  
      res.status(200).json({
        message: 'Message has been sent successfully.',
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while sending the message. Please try again later.',
      });
    }
  });
  
  




module.exports = router;