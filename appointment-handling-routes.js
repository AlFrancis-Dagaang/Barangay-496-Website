const UserServiceData = require('./model/userServiceModel');
const UserAppointment = require('./model/userAppointmentModel');
const express = require('express');
const router = express.Router();


router.post('/validate-appointment-code', async (req, res) => {
    const { appointmentCode } = req.body;

    console.log(appointmentCode);
  
    try {
      // Find the appointment based on the appointment code
      const userWithCode = await UserAppointment.findOne({
        'appointments.appointmentCode': appointmentCode,
      }, {
        appointments: { $elemMatch: { appointmentCode: appointmentCode } },
      });
  
      if (!userWithCode) {
        return res.status(404).json({ status: 'code-not-found' });
      }
  
      const appointment = userWithCode.appointments[0];
  
      if (appointment.dateOfAppointment) {
        // If the appointment date is already set, return that the code is in use
        return res.status(400).json({ status: 'code-in-use' });
      }
  
      // Find the UserServiceData for the corresponding email
      const userServiceData = await UserServiceData.findOne({ email: userWithCode.email });
  
      if (!userServiceData) {
        return res.status(404).json({ status: 'user-data-not-found' });
      }
  
      const requestTypeArray = userServiceData.Type_of_request[appointment.appointmentType];
      const matchingRequest = requestTypeArray.find(request => request.id === appointment.id);
  
      if (!matchingRequest) {
        return res.status(404).json({ status: 'request-not-found' });
      }
  
      // If everything is okay, return a successful response with the appointment and matching request
      return res.status(200).json({ status: 'code-valid', appointment, matchingRequest });
  
    } catch (error) {
      console.error('Error verifying appointment code:', error);
      return res.status(500).json({ status: 'server-error', message: 'An error occurred while verifying the appointment code' });
    }
});

module.exports = router;