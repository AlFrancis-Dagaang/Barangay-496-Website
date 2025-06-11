const express = require('express');
const router = express.Router();
const Verification = require('./model/verificationFormModel');
const ExistingUserData = require("./model/pre-exisingDataResidentModel");
const UserMain = require('./model/userMainModel');
const FullUserInfo =  require('./model/userFullInformationModel');
const UserServiceData = require('./model/userServiceModel');
const { sendEmail } = require('./sendMailer');
const crypto = require("crypto");
const UserAppointment = require('./model/userAppointmentModel');
const UserComplaints = require('./model/userComplaintModel');
const UserMessages = require('./model/userMessagesModel');


router.get('/admin-page', async (req, res) => {
    try {
      // Fetch all documents from the Verification collection
      const verifications = await Verification.find({}); // This fetches all documents
      const userMain = await UserMain.find({}); // This fetches all documents
      const userServiceData = await UserServiceData.find({});
      const userComplaints = await UserComplaints.find({});
      const fullUserInfo = await FullUserInfo.find({});
      const userMessages = await UserMessages.find({});



      //for User Appointments
     // Retrieve all documents in the UserAppointment collection
      const allUserAppointments = await UserAppointment.find(); // Retrieve all documents in the collection

      let appointmentsWithDates = [];

      // Traverse through each document
      allUserAppointments.forEach((document) => {
        // Check if the document has an appointments array
        if (document.appointments && Array.isArray(document.appointments)) {
          // Filter appointments to include only those with a valid dateOfAppointment
          const validAppointments = document.appointments.filter(
            (appointment) =>
              appointment.dateOfAppointment && // Checks if the property exists and is truthy
              !isNaN(Date.parse(appointment.dateOfAppointment)) // Ensure it's a valid date
          );

          // Add the valid appointments to the result array
          appointmentsWithDates.push(...validAppointments); // Spread to add multiple elements at once
        }
      });

      // Render the admin-page EJS view, passing the fetched data
      res.render('admin-page', { verifications, userMain, userServiceData,appointmentsWithDates, userComplaints,fullUserInfo,userMessages });
    } catch (error) {
      console.error('Error fetching data from Verification collection:', error);
      res.status(500).send('Internal Server Error'); // Handle errors
    }
});

router.get('/verification/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const verification = await Verification.findOne({ email: email }); // Fetch verification based on email
        const allUserData = await ExistingUserData.find({}); // Fetch all documents from ExistingUserData
        
        // Prepare the combined response data
        const combinedData = {
            verification,
            allUserData,
        };
        
        // Check if the verification data exists
        if (!verification) {
            return res.status(404).json({ message: 'Verification record not found' }); // No verification data
        }
        
        // Check if there's any data in allUserData
        if (allUserData.length === 0) {
            return res.status(404).json({ message: 'No user data found' }); // No user data
        }
        
        // Return the combined data if all checks are fine
        res.json(combinedData); 
    } catch (error) {
        console.error('Error fetching verification and user data:', error);
        res.status(500).json({ message: 'Internal Server Error' }); // Handle server errors
    }
});

/* Verication for user verification form */
router.post('/Verified-or-Rejected', async (req, res) => {
  const { email, action,message } = req.body; // Get email and action from request body
  
  try {
    // Find the user by email
    const user = await UserMain.findOne({ email });
    const userForm = await Verification.findOne({ email });
    
    if (!user || !userForm) {
      return res.status(404).json({ message: 'User or Verification not found' }); // Return if either is missing
    }

    let subject, emailHtml;
    
    // Handle 'accept' and 'reject' actions
    if (action === 'accept') {
      user.status = 'verified'; // Set verified status for user
      userForm.status = "Approved"; // Set approved status for form
      
      // Update FullUserInfo with userForm data
      const fullUser = await FullUserInfo.findOneAndUpdate(
        { email }, 
        {
          fullName: userForm.fullName,
          birthDate: userForm.birthdate,
          sex: userForm.sex,
          address: userForm.address,
          id: userForm.id,
          status: 'verified', // Set status as verified
        },
        { upsert: true, new: true } // Create if not found, return new document
      );

      await fullUser.save(); // Save the updated record
      
      // Construct email for approved status
      subject = 'Verification Approved';
      emailHtml = `<!DOCTYPE html>
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

    } else if (action === 'reject') {
      user.status = 'notVerified'; // Set not verified status
      userForm.status = "Rejected"; // Set rejected status
      
      // Construct email for rejected status
      subject = 'Verification Rejected';
      emailHtml = `
        <div style="font-family: Arial, sans-serif;">
          <h2>Verification Rejected</h2>
          <p>Unfortunately, your account verification was not approved. Please contact support for further assistance.</p>
          <p>Reason for rejection: <br><br>${message}</p>
        </div>
      `;
    }

    // Send the appropriate email based on the action
    await sendEmail(email, subject, emailHtml);

    // Save the user and userForm changes
    await user.save();
    await userForm.save();

    res.status(200).json({ message: 'User action processed successfully' });

  } catch (error) {
    console.error('Error processing user action:', error);
    res.status(500).json({ message: 'Internal server error' }); // Handle unexpected errors
  }
});

router.delete('/delete-verification/:email', async (req, res) => {
  const email = req.params.email; // Extract the email from the URL
  
  try {
    const result = await Verification.findOneAndDelete({ email }); // Delete the document by email
    
    if (!result) {
      return res.status(404).json({ message: 'Document not found' }); // If no document was found
    }
    
    res.status(200).json({ message: 'Document deleted successfully' }); // Success response
  } catch (error) {
    console.error('Error deleting document:', error); // Log errors
    res.status(500).json({ message: 'Internal server error' }); // Return a 500 error
  }
});

router.post("/get-request-details", async (req, res) => {
  try {
    const { email, requestId, requestType } = req.body; // Get the values sent from the frontend

    // Find the document with the given email
    const userData = await UserServiceData.findOne({ email });

    if (!userData) {
      return res.status(404).json({ message: "User data not found." });
    }

    // Find the specific request type and object by ID
    const requestTypeArray = userData.Type_of_request[requestType]; // Get the correct array based on request type
    if (!requestTypeArray) {
      return res.status(404).json({ message: `No ${requestType} requests found.` });
    }

    const request = requestTypeArray.find((item) => item.id === requestId); // Find the object with the given ID

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Send back the found request object
    res.json(request);
  } catch (error) {
    console.error("Error fetching request details:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});



router.post("/accept-user-request", async (req, res) => {
  const { action, email, requestId, requestType } = req.body;

  if (action !== "Approved" && action !== "Rejected") {
    return res.status(400).json({ error: "Invalid action" });
  }

  const formTitle = {
    Clearance: "Barangay Clearance",
    Certificate: "Barangay Certificate",
    Indigency: "Barangay Indigency",
    Business: "Business Certificate",
  };

  try {
    if (action === "Approved") {
      const appointmentCode = crypto.randomBytes(3).toString("hex").toUpperCase();

      let userAppointment = await UserAppointment.findOne({ email });

      if (!userAppointment) {
        userAppointment = new UserAppointment({ email, appointments: [] });
      }

      userAppointment.appointments.push({
        id: requestId,
        appointmentCode,
        appointmentType: requestType,
      });

      await userAppointment.save();

      const userServiceData = await UserServiceData.findOne({ email });

      if (userServiceData) {
        const requestTypeArray = userServiceData.Type_of_request[requestType];
        
        if (requestTypeArray) {
          const requestObj = requestTypeArray.find((r) => r.id === requestId);
          
          if (requestObj) {
            requestObj.status = "Approved";
            await userServiceData.save(); // Save changes to UserServiceData

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
                <h2 style="font-size: 24px;">Your ${formTitle[requestType]} request has been approved!</h2>
                <h4 style="color: #a4a4a4; margin: 0 20px;">
                Your request made on ${
                  new Date(requestObj.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                } has been approved.Please Use the following code for setting up your appointment.</h4>
                <p style="background-color: #f4ce74; color: rgb(32, 32, 32); letter-spacing: 2px; padding: 10px 20px;font-size: 50px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 800; text-align: center; width: 80%; margin-top: 20px;">${appointmentCode}</p>
              </div>
            </body>
            </html>
            `;

            await sendEmail(email, `Your ${formTitle[requestType]} request has been approved!`, emailHtml);
          }
        }
      }

      return res.status(200).json({ message: "Request approved successfully." });

    } else if (action === "Rejected") {
      const userServiceData = await UserServiceData.findOne({ email });

      if (userServiceData) {
        const requestTypeArray = userServiceData.Type_of_request[requestType];

        if (requestTypeArray) {
          const requestObj = requestTypeArray.find((r) => r.id === requestId);
          
          if (requestObj) {
            requestObj.status = "Rejected"; // Update status to Rejected
            await userServiceData.save(); // Save changes to UserServiceData
            
            const rejectionEmailHtml = `



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
                <h2 style="font-size: 24px;">Your ${formTitle[requestType]} request has been approved!</h2>
                <h4 style="color: #a4a4a4; margin: 0 20px;">
                Your request made on ${
                  new Date(requestObj.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                } has been <span style="color:red; font-weight:500;">rejected</span>.
              </div>
            </body>
            </html>
            `;
            await sendEmail(email, `Your ${formTitle[requestType]} request has been rejected`, rejectionEmailHtml);
          }
        }
      }

      return res.status(200).json({ message: "Request rejected successfully." });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/generate-file', async (req, res) => {
  try {
    const { email, type, id } = req.body; // Extract data from request

    // Find the UserServiceData document based on email
    const userServiceData = await UserServiceData.findOne({ email });
    if (!userServiceData) {
      return res.status(404).json({ error: 'User service data not found' });
    }

    // Find the appropriate request type array
    const requestTypeArray = userServiceData.Type_of_request[type];
    if (!requestTypeArray) {
      return res.status(404).json({ error: `Request type '${type}' not found` });
    }

    // Find the matching request based on ID
    const matchingRequest = requestTypeArray.find((req) => req.id === id);
    if (!matchingRequest) {
      return res.status(404).json({ error: 'Matching request not found' });
    }

    // Create a unique identifier for the file or session
    const uniqueId = matchingRequest.id;

    // Construct the URL to be opened in a new tab
    const renderUrl = `/render-template?type=${type}&id=${id}`;

    // Return the URL for the client to open
    res.status(200).json({ url: renderUrl });
  } catch (error) {
    console.error('Error generating file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/render-template', async (req, res) => {
  try {
    const { type, id} = req.query;

    const userWithAppointment = await UserAppointment.findOne({
      'appointments.id': id,
    });

    if (!userWithAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Find the specific appointment with the given 'id'
    const matchingAppointment = userWithAppointment.appointments.find(
      (appointment) => appointment.id === id
    );

    // Find the matching request in the UserServiceData
    const userServiceData = await UserServiceData.findOne({ email: userWithAppointment.email });

    if (!userServiceData) {
      return res.status(404).send('UserServiceData not found');
    }

    const UserFullInformation = await FullUserInfo.findOne({ email: userServiceData.email });

    // Find the request type array based on the type provided
    const requestTypeArray = userServiceData.Type_of_request[type];
    if (!requestTypeArray) {
      return res.status(404).send(`Request type '${type}' not found`);
    }

    // Find the matching request object
    const matchingRequest = requestTypeArray.find((req) => req.id === id);
    if (!matchingRequest) {
      return res.status(404).send('Matching request not found');
    }

    // Determine the EJS template to render
    let template;
    switch (type) {
      case 'Indigency':
        template = 'Barangay-file/Indigency-file';
        break;
      case 'Clearance':
        template = 'Barangay-file/Clearance-file';
        break;
      case 'Certificate':
        template = 'Barangay-file/Certificate-file';
        break;
      case 'Business':
        template = 'Barangay-file/Business-file';
        break;
      default:
        return res.status(400).send('Unknown type');
    }

    // Render the appropriate EJS template
    res.render(template, { matchingRequest,UserFullInformation, matchingAppointment });
  } catch (error) {
    console.error('Error rendering template:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/get-user-appointment-detail', async (req, res) => {
  try {
      const { appointmentCode, id,email } = req.body;

      const dataEmail = email; // Use session email to find the user
      const userAppointment = await UserAppointment.findOne({ email: dataEmail });


      

      if (!userAppointment) {
          return res.status(404).json({ error: 'User appointment data not found' });
      }

      // Find the appointment by appointment code
      const matchingAppointment = userAppointment.appointments.find(
          (appt) => appt.appointmentCode === appointmentCode
      );
      
      

      if (!matchingAppointment) {
          return res.status(404).json({ error: 'Appointment not found' });
      }

      const userServiceData = await UserServiceData.findOne({ email: dataEmail  });

      if (!userServiceData) {
          return res.status(404).json({ error: 'UserServiceData not found' });
      }

  

      // Find the corresponding request in UserServiceData based on the appointmentType and ID
      const requestTypeArray = userServiceData.Type_of_request[matchingAppointment.appointmentType];

      if (!requestTypeArray) {
          return res.status(404).json({ error: `Request type '${matchingAppointment.appointmentType}' not found` });
      }

      const matchingRequest = requestTypeArray.find((req) => req.id === id);

      if (!matchingRequest) {
          return res.status(404).json({ error: 'Matching request not found' });
      }

      // Return the matching appointment and request data to the frontend
      return res.status(200).json({
          appointment: matchingAppointment,
          request: matchingRequest,
      });
  } catch (error) {
      console.error('Error fetching appointment details:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/get-complaint-details', async (req, res) => {
  const { email, id } = req.body; // Extract email and complaint ID from request

  try {
    // Find the user document by email
    const userComplaintDoc = await UserComplaints.findOne({ email });

    if (!userComplaintDoc) {
      return res.status(404).json({ error: 'User complaint not found' });
    }

    // Find the complaint with the specified ID
    const complaint = userComplaintDoc.complaint_information.find(
      (complaint) => complaint.id === id
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Prepare the response data
    const responseData = {
      firstName: complaint.firstName,
      lastName: complaint.lastName,
      phoneNumber: complaint.phoneNumber,
      category: complaint.category,
      formattedDate: new Date(complaint.dateOfComplaint).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      status: complaint.status,
      description: complaint.description,
    };

    // Send the complaint data back to the frontend
    res.json(responseData);

  } catch (error) {
    console.error('Error retrieving complaint details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update-complaint-status', async (req, res) => {
  const { email, id, action } = req.body;

  try {
    const userComplaintDoc = await UserComplaints.findOne({ email });

    if (!userComplaintDoc) {
      return res.status(404).json({ error: 'User complaint not found' });
    }

    const complaint = userComplaintDoc.complaint_information.find(
      (c) => c.id === id
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    complaint.status = action; // Set the new status based on the action

    await userComplaintDoc.save(); // Save the updated document

    res.status(200).json({ success: true, message: `Complaint ${action.toLowerCase()}ed successfully` });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/solve-complaint-status', async (req, res) => {
  const { email, id, action, resolvedInfo } = req.body; // Get email, complaint ID, and action from the request

  try {
      // Find the UserComplaint document by email
      const userComplaint = await UserComplaints.findOne({ email });
      
      if (!userComplaint) {
          return res.status(404).json({ error: 'UserComplaint not found' });
      }

      // Find the specific complaint by ID within the complaint_information array
      const complaint = userComplaint.complaint_information.find((c) => c.id === id);

      if (!complaint) {
          return res.status(404).json({ error: 'Complaint not found' });
      }

      // Update the complaint status to 'Solved'
      complaint.status = action; // Set the status to the action ("Solved")
      complaint.resolvedInformation = resolvedInfo;

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
          <h2 style="font-size: 24px;">Complaint Resolved!</h2>
          <h4 style="color: #a4a4a4; margin: 0 20px;">
          Your complaint about the ${complaint.category}  has been resolved.
          </h4>
        </div>
      </body>
      </html>
      `;

      await sendEmail(email, `Complaint Resolved!`, emailHtml);

      // Save the updated document
      await userComplaint.save();

      res.status(200).json({ message: 'Complaint status updated successfully' });
  } catch (error) {
      console.error('Error updating complaint status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/get-resident-info', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the resident with the given email
    const resident = await FullUserInfo.findOne({ email });

    if (!resident) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.status(200).json(resident); // Return the resident information
  } catch (error) {
    console.error('Error fetching resident information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/get-message-details', async (req, res) => {
  try {
    const { email, id } = req.query;

    // Validate that both email and id are provided
    if (!email || !id) {
      return res.status(400).json({
        error: 'Email and ID are required to fetch message details.',
      });
    }

    // Find the document in UserMessages by email and ID
    const message = await UserMessages.findOne({ email, _id: id });

    if (!message) {
      return res.status(404).json({
        error: 'Message not found.',
      });
    }

    // Return the document details
    res.status(200).json({
      name: message.name,
      email: message.email,
      message: message.message,
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while retrieving message details.',
    });
  }
});

router.post('/reply-to-message', async (req, res) => {
  try {
    const { email, id, reply } = req.body;

    if (!email || !id || !reply) {
      return res.status(400).json({
        error: 'Email, ID, and reply are required.',
      });
    }

    // Find the message by email and ID
    const message = await UserMessages.findOne({ email, _id: id });

    if (!message) {
      return res.status(404).json({
        error: 'Message not found.',
      });
    }

    // Send an email with the reply
    const subject = 'From Barangay 496';
    const html = `<p>${reply}</p>`; // Email content in HTML format
    await sendEmail(email, subject, html); // Send the email

    // Update the document's status to "Replied"
    message.status = 'Replied';
    await message.save(); // Save the updated document

    // Respond with success
    res.status(200).json({
      success: 'Reply sent successfully.',
    });
  } catch (error) {
    console.error('Error in /reply-to-message:', error);
    res.status(500).json({
      error: 'An error occurred while sending the reply.',
    });
  }
});

router.delete('/delete-user-message', async (req, res) => {
  try {
    const { email, id } = req.body;

    if (!email || !id) {
      return res.status(400).json({
        error: 'Email and ID are required.',
      });
    }

    // Find and delete the document with the specified email and ID
    const deletedMessage = await UserMessages.findOneAndDelete({ email, _id: id });

    if (!deletedMessage) {
      return res.status(404).json({
        error: 'Message not found.',
      });
    }

    res.status(200).json({
      success: 'Message deleted successfully.',
    });
  } catch (error) {
    console.error('Error in /delete-user-message:', error);
    res.status(500).json({
      error: 'An unexpected error occurred.',
    });
  }
});

router.post('/send-email', async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ success: false, error: "Email and message are required." });
    }

    // Send email using the provided email and message
    await sendEmail(email, "Your Message", message);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

router.post('/complete-user-appointment', async (req, res) => {
  const { dataAppointmentCode, dataId, dataEmail } = req.body;

  try {
      // Find the user's appointment
      const userAppointment = await UserAppointment.findOne({ email: dataEmail });
      const userServiceData = await UserServiceData.findOne({ email: dataEmail });

      if (!userAppointment || !userServiceData) {
          return res.status(404).json({ error: 'User data not found' });
      }

      // Find the appointment to update
      const appointmentToUpdate = userAppointment.appointments.find(
          (appt) => appt.appointmentCode === dataAppointmentCode
      );

      if (!appointmentToUpdate) {
          return res.status(404).json({ error: 'Appointment not found' });
      }

      // Update appointment status
      appointmentToUpdate.status = 'Completed';

      // Find the matching request in UserServiceData and update the status
      const requestTypeArray = userServiceData.Type_of_request[appointmentToUpdate.appointmentType];
      const requestToUpdate = requestTypeArray.find((req) => req.id === dataId);

      if (!requestToUpdate) {
          return res.status(404).json({ error: 'Matching request not found' });
      }

      requestToUpdate.status = 'Completed';

      // Save the updates
      await userAppointment.save();
      await userServiceData.save();

      res.json({ message: 'Appointment completed successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});




router.get('/home-page', (req, res) => {
  res.render('front');
});



module.exports = router;
