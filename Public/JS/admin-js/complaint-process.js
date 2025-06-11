document.addEventListener('DOMContentLoaded', () => {
    const acknowledgeComplaints = document.querySelectorAll('.actions-complaints div[data-icon="acknowledge-user-complaints"]');
    const viewUserComplaints = document.querySelectorAll('.actions-complaints div[data-icon="view-user-complaints"]');
    const solveUserComplaints = document.querySelectorAll('.actions-complaints div[data-icon="solved-user-complaints"]');

    acknowledgeComplaints.forEach((icon) => {
      icon.addEventListener('click', async () => {
        const parentDiv = icon.closest('.each-user-conts'); // Find the parent div
        const email = parentDiv.getAttribute('data-email'); // Get the email from the div
        const id = parentDiv.getAttribute('data-id'); // Get the complaint ID
  
        try {
          const response = await fetch('/get-complaint-details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, id }), // Send email and ID to backend
          });
  
          if (response.ok) {
            const complaintData = await response.json(); 
  

            Swal.fire({
                html:
                `
                <div class="cmplt-view-conts">
                    <div class="cpmlt-header">
                        Complaint Information
                    </div> 
                    <div class="cmplt-info">
                        <div>
                            <div class="bold">
                                Complaint Category:
                            </div>
                            <div class="normal">
                            ${complaintData.category}
                            </div>
                        </div>
                        <hr style="height: 2px; background-color: black;">
                        <div>
                            <div class="bold" >
                                First Name:
                            </div>
                            <div class="normal">
                            ${complaintData.firstName}
                            </div>
                        </div>
                        <div>
                            <div class="bold">
                                Last Name:
                            </div>
                            <div class="normal">
                            ${complaintData.lastName}
                            </div>
                        </div>
                        <div>
                            <div class="bold">
                                Phone Number:
                            </div>
                            <div class="normal">
                            ${complaintData.phoneNumber}
                            </div>
                        </div>
                        <div>
                            <div class="bold">
                                Data issue:
                            </div>
                            <div class="normal">
                            ${complaintData.formattedDate}
                            </div>
                        </div>
                        <div class="cmplt-description">
                            <div class="bold">
                                Details:
                            </div>
                            <div class="normal">
                            ${complaintData.description}
                            </div>
                        </div>
                    </div>
                    <div class="buttons-cmplt">
                        <button id="acknowledge-cmplt">Acknowledge</button>
                        <button id="reject-cmplt">Reject</button>
                    </div>
                <div>
               `,
                customClass: {
                    popup: 'view-complaint-style-swal', // This will apply your custom class
                },
                showConfirmButton: false,
                allowOutsideClick: true, // Allows clicking outside to close
                hideClass: {
                    popup: 'my-fade-out', // Custom fade-out animation
                },
                didOpen: function () {
                    const acknowledgeButton = document.getElementById("acknowledge-cmplt");
                    const rejectButton = document.getElementById("reject-cmplt");
    
                    const handleAction = async (action) => {
                        const requestData = {
                            email,
                            id,
                            action, // The action being taken (Acknowledge or Reject)
                        };
    
                        try {
                            const response = await fetch("/update-complaint-status", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(requestData),
                            });
    
                            if (response.ok) {
                                Swal.fire({
                                    title: `${action} Successful!`,
                                    text: `Complaint has been ${action.toLowerCase()} successfully.`,
                                    icon: "success",
                                    showConfirmButton: true, // Display confirm button
                                    confirmButtonText: 'OK', // Customize confirm button text
                                    confirmButtonColor: 'rgb(22, 21, 21)',
                                }).then(() => {
                                    location.reload(); // Reload the page when the user clicks OK
                                });
                            } else {
                                throw new Error("Failed to update complaint status");
                            }
                        } catch (error) {
                            console.error("Error:", error);
                            Swal.fire({
                                title: "Error",
                                text: `Failed to ${action.toLowerCase()} the complaint.`,
                                icon: "error",
                            });
                        }
                    };
    
                    acknowledgeButton.addEventListener("click", () => handleAction("Acknowledged"));
                    rejectButton.addEventListener("click", () => handleAction("Rejected"));
                },
 
            });

          } else {
            throw new Error('Failed to fetch complaint details');
          }
        } catch (error) {
          console.error('Error fetching complaint details:', error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while fetching complaint details.',
            icon: 'error',
          });
        }
      });
    });


    viewUserComplaints.forEach((icon) => {
        icon.addEventListener('click', async () => {
          const parentDiv = icon.closest('.each-user-conts'); // Find the parent div
          const email = parentDiv.getAttribute('data-email'); // Get the email from the div
          const id = parentDiv.getAttribute('data-id'); // Get the complaint ID
    
          try {
            const response = await fetch('/get-complaint-details', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, id }), // Send email and ID to backend
            });
    
            if (response.ok) {
              const complaintData = await response.json(); 
    
  
              Swal.fire({
                  html:
                  `
                  <div class="cmplt-view-conts">
                      <div class="cpmlt-header">
                          Complaint Information
                      </div> 
                      <div class="cmplt-info">
                          <div>
                              <div class="bold">
                                  Complaint Category:
                              </div>
                              <div class="normal">
                              ${complaintData.category}
                              </div>
                          </div>
                          <hr style="height: 2px; background-color: black;">
                          <div>
                              <div class="bold" >
                                  First Name:
                              </div>
                              <div class="normal">
                              ${complaintData.firstName}
                              </div>
                          </div>
                          <div>
                              <div class="bold">
                                  Last Name:
                              </div>
                              <div class="normal">
                              ${complaintData.lastName}
                              </div>
                          </div>
                          <div>
                              <div class="bold">
                                  Phone Number:
                              </div>
                              <div class="normal">
                              ${complaintData.phoneNumber}
                              </div>
                          </div>
                          <div>
                              <div class="bold">
                                  Data issue:
                              </div>
                              <div class="normal">
                              ${complaintData.formattedDate}
                              </div>
                          </div>
                          <div class="cmplt-description">
                              <div class="bold">
                                  Details:
                              </div>
                              <div class="normal">
                              ${complaintData.description}
                              </div>
                          </div>
                      </div>
                      <div class="complt-footer"></div>
                  <div>
                 `,
                  customClass: {
                      popup: 'view-complaint-style-swal', // This will apply your custom class
                  },
                  showConfirmButton: false,
                  allowOutsideClick: true, // Allows clicking outside to close
                  hideClass: {
                      popup: 'my-fade-out', // Custom fade-out animation
                  },
              });
  
            } else {
              throw new Error('Failed to fetch complaint details');
            }
          } catch (error) {
            console.error('Error fetching complaint details:', error);
            Swal.fire({
              title: 'Error',
              text: 'An error occurred while fetching complaint details.',
              icon: 'error',
            });
          }
        });
      });


      solveUserComplaints.forEach((icon) => {
        icon.addEventListener('click', async () => {
          const parentDiv = icon.closest('.each-user-conts'); // Find the parent div
          const email = parentDiv.getAttribute('data-email'); // Get the email from the div
          const id = parentDiv.getAttribute('data-id'); // Get the complaint ID
    
          try {
            const response = await fetch('/get-complaint-details', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, id }), // Send email and ID to backend
            });
    
            if (response.ok) {
              const complaintData = await response.json(); 
    
  
              Swal.fire({
                  html:
                  `
                  <div class="cmplt-view-conts">
                      <div class="cpmlt-header">
                          Complaint Information
                      </div> 
                      <div class="cmplt-info">
                          <div>
                              <div class="bold">
                                  Complaint Category:
                              </div>
                              <div class="normal">
                              ${complaintData.category}
                              </div>
                          </div>
                          <hr style="height: 2px; background-color: black;">
                          <div>
                              <div class="bold" >
                                  First Name:
                              </div>
                              <div class="normal">
                              ${complaintData.firstName}
                              </div>
                          </div>
                          <div>
                              <div class="bold">
                                  Last Name:
                              </div>
                              <div class="normal">
                              ${complaintData.lastName}
                              </div>
                          </div>
                          <div>
                              <div class="bold">
                                  Phone Number:
                              </div>
                              <div class="normal">
                              ${complaintData.phoneNumber}
                              </div>
                          </div>
                          <div>
                              <div class="bold">
                                  Data issue:
                              </div>
                              <div class="normal">
                              ${complaintData.formattedDate}
                              </div>
                          </div>
                          <div class="cmplt-description">
                              <div class="bold">
                                  Details:
                              </div>
                              <div class="normal">
                              ${complaintData.description}
                              </div>
                          </div>
                      </div>
                      <div class="buttons-cmplt">
                          <button id="acknowledge-cmplt">Resolved Issue</button>
                      </div>
                  <div>
                 `,
                  customClass: {
                      popup: 'view-complaint-style-swal', // This will apply your custom class
                  },
                  showConfirmButton: false,
                  allowOutsideClick: true, // Allows clicking outside to close
                  hideClass: {
                      popup: 'my-fade-out', // Custom fade-out animation
                  },
                  didOpen: function () {

                    document.getElementById('acknowledge-cmplt').addEventListener('click', function() {
                        Swal.fire({
                            customClass: {
                                popup: 'resolved-information', // Custom fade-out animation
                            },
                            showConfirmButton: false,
                            html: `
                            <div class="rslvd-cnts">
                            <h2>Please provide details for any action taken</h2>

                            <div class="text-area">
                                <textarea id="txt"placeholder="provide any details"> </textarea>
                            </div>
                            <p id="rqr"><ion-icon name="alert-circle-outline"></ion-icon>Required</p>
                            <button id="resolve-complete">Resolved Complete</button> 
                            </div>
                            `,
                        });

                        const acknowledgeButton = document.getElementById("resolve-complete");

                        const handleAction = async (action) => {
  
                          const resolvedInfo = document.getElementById('txt').value.trim();
  
                          const message= document.getElementById('rqr');
                          if(!resolvedInfo){
                              message.style.visibility = "visible";
                              return;
                          }
  
                            const requestData = {
                                email,
                                id,
                                action,
                                resolvedInfo,
                            };
  
                            console.log("resolveInfo:", document.getElementById("txt").value);
  
                            const loadingSwal = Swal.fire({
                              allowOutsideClick: false, // Prevent closing by clicking outside
                              showConfirmButton: false, // Hide the confirm button
                              willOpen: () => {
                                  Swal.showLoading(); // Show the loading spinner
                              },
                          });
  
                            try {
                                const response = await fetch("/solve-complaint-status", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(requestData),
                                });
  
                                if (response.ok) {
                                  loadingSwal.close();
                                    Swal.fire({
                                        title: `${action} Successful!`,
                                        text: `Complaint has been resolved successfully.`,
                                        icon: "success",
                                        showConfirmButton: true, // Display confirm button
                                        confirmButtonText: 'OK', // Customize confirm button text
                                        confirmButtonColor: 'rgb(22, 21, 21)',
                                    }).then(() => {
                                      location.reload(); // Reload the page when the user clicks OK
                                  });
                                } else {
                                    throw new Error("Failed to update complaint status");
                                }
                            } catch (error) {
                                console.error("Error:", error);
                                Swal.fire({
                                    title: "Error",
                                    text: `Failed to ${action.toLowerCase()} the complaint.`,
                                    icon: "error",
                                });
                            }
                        };
        
                        acknowledgeButton.addEventListener("click", () => handleAction("Resolved"));
                    });
                },
   
              });
  
            } else {
              throw new Error('Failed to fetch complaint details');
            }
          } catch (error) {
            console.error('Error fetching complaint details:', error);
            Swal.fire({
              title: 'Error',
              text: 'An error occurred while fetching complaint details.',
              icon: 'error',
            });
          }
        });
      });





});
  
