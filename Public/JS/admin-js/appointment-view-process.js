document.addEventListener('DOMContentLoaded', () => {
    const viewUserAppointmentIcons = document.querySelectorAll(
      '.appointment-section .actions div[data-icon="admin-view-appointment"]'
    );
  
    viewUserAppointmentIcons.forEach((icon) => {
      icon.addEventListener('click', async () => {
        const closestElement = icon.closest('.each-user-conts');
        const dataAppointmentCode = closestElement.getAttribute('data-code');
        const dataId = closestElement.getAttribute('data-id');
        const dataEmail = closestElement.getAttribute('data-email');
  
        const requestData = {
          appointmentCode: dataAppointmentCode,
          id: dataId,
          email: dataEmail,
        };

        console.log(requestData);
        try {
          const response = await fetch('/get-user-appointment-detail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
  
          if (response.ok) {
            const responseData = await response.json();
            const { appointment, request } = responseData;
  
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(request.createdAt));
  
            const documentType = ['Clearance', 'Indigency', 'Certificate', 'Business'].includes(
              appointment.appointmentType
            )
              ? 'Document Request'
              : 'Unknown Type';
  
              let requestType; // Declare the variable to hold document type

              if (['Clearance', 'Indigency', 'Certificate'].includes(appointment.appointmentType)) {
                  requestType = 'Barangay '+appointment.appointmentType; // Set to 'Document Request' if it matches
              } else {
                  requestType = 'Business Certificate'; // Set to 'Unknown' if it doesn't match
              }
  
            Swal.fire({
              html: `
              <div class="document-request-conts">
                  <div class="heading">Document Information</div>
                  <div class="content">
                      <div>
                          <div class="bold">Appointment-code:</div>
                          <div class="normal">${appointment.appointmentCode}</div>
                      </div>
                      <hr style="height: 2px;">
                      <div>
                          <div class="bold">Name:</div>
                          <div class="normal">${request.name}</div>
                      </div>
                      <div>
                          <div class="bold">Appointment Type:</div>
                          <div class="normal">${documentType}</div>
                      </div>
                      <div>
                          <div class="bold">Request Type:</div>
                          <div class="normal">${requestType}</div>
                      </div>
                      <div>
                          <div class="bold">Quantity:</div>
                          <div class="normal">${request.quantity}</div>
                      </div>
                      <div>
                          <div class="bold">Purpose:</div>
                          <div class="normal">${request.purpose}</div>
                      </div>
                      <div>
                          <div class="bold">Date Requested:</div>
                          <div class="normal">${formattedDate}</div>
                      </div>
                  </div>
                  <div class="view-button-appointments">
                  <button id="complete-appointment">Complete appointment</button>
                </div>
              </div>
              `,
              customClass: {
                popup: 'Document-request-swal', // This will apply your custom class
            },
              showConfirmButton: false,
              allowOutsideClick: true,
            });


            document.getElementById('complete-appointment').addEventListener('click', async function() {
          
              const data = { dataAppointmentCode, dataId, dataEmail };
          
              try {
                  const response = await fetch('/complete-user-appointment', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(data)
                  });
          
                  const result = await response.json();
          
                  if (response.ok) {
                      Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: 'Appointment completed successfully!',
                          showConfirmButton: true, // Display confirm button
                          confirmButtonText: 'OK', // Customize confirm button text
                          confirmButtonColor: 'rgb(22, 21, 21)',
                      }).then(() => {
                        location.reload(); // Reload the page when the user clicks OK
                    });
                  } else {
                      Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: result.error,
                      });
                  }
              } catch (error) {
                  Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'An error occurred while completing the appointment.',
                  });
              }
          });


          } else {
            throw new Error('Failed to fetch appointment details');
          }
        } catch (error) {

            console.log(error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while fetching appointment details.',
            icon: 'error',
          });
        }
      });
    });
});
  