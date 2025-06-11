const express = require('express');
const router = express.Router();
const UserMain = require('./model/userMainModel');
const UserServiceData = require('./model/userServiceModel');
const UserAppointment = require('./model/userAppointmentModel');
const UserComplaints = require('./model/userComplaintModel');

router.get('/status-hub', async (req, res) => {
    try {
        const email = req.session.email; 

        if (!email) {
          return res.redirect('/');
        }

        const userMainData = await UserMain.findOne({ email });

        // Find user data from UserServiceData model
        const userServiceData = await UserServiceData.findOne({ email });

        const userAppointment = await UserAppointment.findOne({ email });

        const userComplaint = await UserComplaints.findOne({ email });

        let userAppointmentsWithDates = [];

        // Check if the userAppointment and the appointments array are valid
        if (userAppointment && Array.isArray(userAppointment.appointments)) {
            // Filter appointments to include only those with a valid dateOfAppointment
            userAppointmentsWithDates = userAppointment.appointments.filter(
                (appointment) => 
                    appointment.dateOfAppointment && // Checks if the property exists and is truthy
                    !isNaN(Date.parse(appointment.dateOfAppointment)) // Ensure it's a valid date
            );
        }

        // Render the EJS template with both sets of user data
        res.render('statusHub', { userMainData, userServiceData, userAppointmentsWithDates, userComplaint });

    } catch (error) {
        console.error(error);
        // Handle errors
        res.status(500).send('Internal Server Error');
    }
});

router.get('/getViewData', async (req, res) => {
    try {
        // Retrieve the session email from the request
        const sessionEmail = req.session.email;
        
        if (!sessionEmail) {
            // If session email is not found, send an error response
            return res.status(400).json({ error: 'Session email not found' });
        }
        
        // Find the user data based on the session email
        const userData = await UserServiceData.findOne({ email: sessionEmail });
        
        if (!userData) {
            // If user data is not found, send an error response
            return res.status(404).json({ error: 'User data not found' });
        }
        
        // Check if the dataType exists in the userData.Type_of_request object
        if (!userData.Type_of_request) {
            return res.status(404).json({ error: 'Data type not found' });
        }

        // Send the entire userData.Type_of_request object
        return res.json({
            email: userData.email,  // Include the session email
            Type_of_request: userData.Type_of_request  // Include the request data
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/cancel-request', async (req, res) => {
    try {
        const { requestId, dataType } = req.body; // Extract data from the POST request

        // Find the UserServiceData document by session email
        const userServiceData = await UserServiceData.findOne({ email: req.session.email });

        if (!userServiceData) {
            return res.status(404).json({ error: 'User data not found' });
        }

        // Find the specific request in the appropriate data type
        const requestTypeArray = userServiceData.Type_of_request[dataType];
        const matchingRequest = requestTypeArray.find((request) => request.id === requestId);

        if (!matchingRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Update the request status to "Cancel"
        matchingRequest.status = 'Cancelled';

        await userServiceData.save(); // Save the changes

        res.status(200).json({ message: 'Request cancelled successfully' }); // Send a success response
    } catch (error) {
        console.error('Error cancelling request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/delete-request', async (req, res) => {
  try {
      const { requestId, dataType } = req.body; // Get the request ID and data type from the POST request
      const email = req.session.email; // Get the session email
      
      // Find the UserServiceData document by session email
      const userServiceData = await UserServiceData.findOne({ email });
      
      if (!userServiceData) {
          return res.status(404).json({ error: 'UserServiceData not found' });
      }

      // Find the appropriate request type array (e.g., 'Clearance', 'Indigency', etc.)
      const requestTypeArray = userServiceData.Type_of_request[dataType];
      
      if (!requestTypeArray) {
          return res.status(404).json({ error: `Request type '${dataType}' not found` });
      }

      // Find the matching request object within the array
      const requestIndex = requestTypeArray.findIndex((request) => request.id === requestId);
      
      if (requestIndex === -1) {
          return res.status(404).json({ error: 'Request not found' });
      }

      // Remove the specific request from the array
      requestTypeArray.splice(requestIndex, 1);

      // Find and remove the corresponding appointment from UserAppointment (if it exists)
      const userAppointment = await UserAppointment.findOne({ email });

      if (userAppointment && userAppointment.appointments) {
          // Find the appointment with the matching ID
          const appointmentIndex = userAppointment.appointments.findIndex((appt) => appt.id === requestId);

          if (appointmentIndex !== -1) {
              // If the appointment exists, remove it
              userAppointment.appointments.splice(appointmentIndex, 1);

              // Save the updated UserAppointment document
              await userAppointment.save();
          }
      }

      // Save the updated UserServiceData document
      await userServiceData.save();

      // Return a success response
      res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
      console.error('Error deleting request:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/editData', async (req, res) => {
    try {
      const { email, information } = req.body; 
      const { requestId, dataType, name, phoneNumber, quantity, purpose } = information;
  
      // Find the UserServiceData document by session email
      const userServiceData = await UserServiceData.findOne({ email: email });
  
      if (!userServiceData) {
        return res.status(404).json({ error: 'UserServiceData not found' });
      }
  
      // Find the appropriate request type array based on dataType
      const requestTypeArray = userServiceData.Type_of_request[dataType];
  
      if (!requestTypeArray) {
        return res.status(404).json({ error: `Request type '${dataType}' not found` });
      }
  
      // Find the specific request by requestId
      const matchingRequest = requestTypeArray.find(request => request.id === requestId);
  
      if (!matchingRequest) {
        return res.status(404).json({ error: 'Request not found' });
      }
  
      // Update the request data
      matchingRequest.name = name;
      matchingRequest.number = phoneNumber;
      matchingRequest.quantity = quantity;
      matchingRequest.purpose = purpose;
  
      // Save the updated document
      await userServiceData.save();
  
      res.status(200).json({ message: 'Request updated successfully' }); // Success response
    } catch (error) {
      console.error('Error updating request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/get-appointment-details', async (req, res) => {
    try {
        const { appointmentCode, id } = req.body;

        const email = req.session.email; // Use session email to find the user
        const userAppointment = await UserAppointment.findOne({ email });

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

        const userServiceData = await UserServiceData.findOne({ email });

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

router.post('/update-appointment-status', async (req, res) => {
    try {
      const { action, appointment, matchingRequest } = req.body;
      const email = req.session.email; // Get the session email

      console.log(appointment, matchingRequest, action);

      // Find the user's appointment
      const userAppointment = await UserAppointment.findOne({ email });
      const userServiceData = await UserServiceData.findOne({ email });
  
      if (!userAppointment || !userServiceData) {
        return res.status(404).json({ error: 'User data not found' });
      }
  
      // Find the appointment to update
      const appointmentToUpdate = userAppointment.appointments.find(
        (appt) => appt.appointmentCode === appointment.appointmentCode
      );
  
      if (!appointmentToUpdate) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
  
      // Update appointment status
      appointmentToUpdate.status = action === 'Complete' ? 'Completed' : 'Cancelled';
  
      // Find the matching request in UserServiceData and update the status
      const requestTypeArray = userServiceData.Type_of_request[appointment.appointmentType];
      const requestToUpdate = requestTypeArray.find((req) => req.id === matchingRequest.id);
  
      if (!requestToUpdate) {
        return res.status(404).json({ error: 'Matching request not found' });
      }
  
      requestToUpdate.status = action === 'Complete' ? 'Completed' : 'Cancelled';
  
      // Save the updates
      await userAppointment.save();
      await userServiceData.save();
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  router.post('/delete-appointment', async (req, res) => {
    try {
        const { dataAppointmentCode } = req.body; // Extract from the request
        const email = req.session.email; // Email from session

        // Find the UserAppointment document by email
        const userAppointment = await UserAppointment.findOne({ email });

        if (!userAppointment) {
            return res.status(404).json({ error: 'UserAppointment not found' });
        }

        // Find the specific appointment by its appointment code
        const appointmentIndex = userAppointment.appointments.findIndex(
            (appointment) => appointment.appointmentCode === dataAppointmentCode
        );

        if (appointmentIndex === -1) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Remove the appointment from the array
        const removedAppointment = userAppointment.appointments.splice(appointmentIndex, 1)[0]; // Store the removed appointment
        
        // Save the updated UserAppointment document
        await userAppointment.save();

        // Try to find and delete the corresponding request in UserServiceData
        const userServiceData = await UserServiceData.findOne({ email });

        if (userServiceData && userServiceData.Type_of_request && removedAppointment) {
            // Get the request array for the appropriate appointment type
            const appointmentType = removedAppointment.appointmentType;
            const appointmentId = removedAppointment.id; // The ID of the removed appointment

            if (appointmentType && userServiceData.Type_of_request[appointmentType]) {
                const requestArray = userServiceData.Type_of_request[appointmentType];

                const requestIndex = requestArray.findIndex(
                    (request) => request.id === appointmentId // Use the ID of the removed appointment
                );

                if (requestIndex !== -1) {
                    // If found, remove the request from the appropriate array
                    requestArray.splice(requestIndex, 1);
                    await userServiceData.save(); // Save changes to UserServiceData
                }
            }
        }

        // Return a success response
        res.status(200).json({ message: 'Appointment deleted successfully' });

    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  router.post('/edit-complaint', async (req, res) => {
    try {
      const { firstName, lastName, phoneNumber, category, description, id } = req.body; // Extract the updated complaint information
      
      console.log( id);
      // Find the user's complaint document by session email
      const userComplaint = await UserComplaints.findOne({ email: req.session.email });

      
      if (!userComplaint) {
        return res.status(404).json({ error: 'User complaint data not found' });
      }
  
      // Find the specific complaint to be updated by its unique ID
      const complaint = userComplaint.complaint_information.find((c) => c.id === id);
      

      if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
  
      // Update the complaint information with the new details
      complaint.firstName = firstName;
      complaint.lastName = lastName;
      complaint.phoneNumber = phoneNumber;
      complaint.category = category;
      complaint.description = description;
  
      // Save the changes to the document
      await userComplaint.save();
  
      // Return a success response
      res.status(200).json({ success: true, message: 'Complaint updated successfully' });
    } catch (error) {
      console.error('Error updating complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/delete-complaint', async (req, res) => {
    try {
      const { email, id } = req.body;
  
      // Find the document with the specified email
      const userComplaint = await UserComplaints.findOne({ email });
  
      if (!userComplaint) {
        return res.status(404).json({ error: 'User complaint not found' });
      }
  
      // Find the index of the complaint to delete
      const indexToDelete = userComplaint.complaint_information.findIndex((complaint) => complaint.id === id);
  
      if (indexToDelete === -1) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
  
      // Remove the complaint from the array
      userComplaint.complaint_information.splice(indexToDelete, 1);
  
      // Save the changes
      await userComplaint.save();
  
      res.status(200).json({ success: true, message: 'Complaint deleted successfully' });
    } catch (error) {
      console.error('Error deleting complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/cancel-complaint', async (req, res) => {
    try {
      const { email, id } = req.body;
  
      // Find the document with the specified email
      const userComplaint = await UserComplaints.findOne({ email });
  
      if (!userComplaint) {
        return res.status(404).json({ error: 'User complaint not found' });
      }
  
      // Find the complaint by ID and update its status
      const complaint = userComplaint.complaint_information.find((complaint) => complaint.id === id);
  
      if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
  
      // Update the status to 'Cancel'
      complaint.status = 'Cancelled';
  
      // Save the changes
      await userComplaint.save();
  
      res.status(200).json({ success: true, message: 'Complaint cancelled successfully' });
    } catch (error) {
      console.error('Error canceling complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  



module.exports = router;