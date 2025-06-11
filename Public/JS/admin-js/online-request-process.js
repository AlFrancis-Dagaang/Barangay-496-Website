document.addEventListener("DOMContentLoaded", () => {
    const viewButtons = document.querySelectorAll(".each-user-conts .accept-or-not"); // All view buttons
  
    viewButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const parentContainer = event.currentTarget.closest(".each-user-conts"); // Get the parent container
        const email = parentContainer.getAttribute("data-email");
        const requestId = parentContainer.getAttribute("data-id");
        const requestType = parentContainer.getAttribute("data-type");
  
        // Send data to the backend to fetch the corresponding request
        fetch("/get-request-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, requestId, requestType }), // Send the data attributes to the backend
        })
          .then(response => response.json()) // Parse the JSON response
          .then(data => {
            // Display the request details in the Swal alert
            const nameParts = data.name.split(' ');

            let firstName = '';
            let middleName = '';
            let lastName = '';
        
            // Determine middle name based on the presence of a period
            const middleNameIndex = nameParts.findIndex((part) => part.includes('.'));
        
            if (middleNameIndex >= 0) {
                middleName = nameParts[middleNameIndex].replace('.', ''); // Remove the period
                firstName = nameParts.slice(0, middleNameIndex).join(' '); // Everything before middle name
                lastName = nameParts.slice(middleNameIndex + 1).join(' '); // Everything after middle name
            } else {
                // No middle name, assume first name and last name
                firstName = nameParts[0];
                lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
            }
        
            console.log(`First Name: ${firstName}`);
            console.log(`Middle Name: ${middleName}`);
            console.log(`Last Name: ${lastName}`);
            // Change the title based on dataType
            const formTitle = {
                Clearance: 'Barangay Clearance',
                Certificate: 'Barangay Certificate',
                Indigency: 'Barangay Indigency',
                Business: 'Business Certificate',
            };

            const swalContent = `
                <div class="BarangayCertificate-conts">
                    <div class="first-section" style="border-top: 10px solid black;">
                        <h2 style="color:black;">${formTitle[requestType]}</h2>
                        <p>Resident data is recorded here</p>
                    </div>
                    <div class="second-section">
                        <p id="title" style="color:black;">Full name</p>
                        <div class="full-name">
                            <div class="firstName">
                                <p>First Name</p>
                                <div class="input-container inputs">
                                    <input type="text" value="${firstName}" style="color: black;">
                                </div>
                            </div>
                            <div class="middleName">
                                <p>Middle Name</p>
                                <div class="input-container inputs">
                                    <input type="text" value="${middleName}" style="color: black;">
                                </div>
                            </div>
                            <div class="lastName">
                                <p>Last Name</p>
                                <div class="input-container inputs">
                                    <input type="text" value="${lastName}" style="color: black;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="BarangayCertificate-third-section">
                        <div class="phoneNumber">
                            <label style="color:black;">Phone Number</label>
                            <input type="text" value="${data.number}" style="color: black;">
                        </div>
                        <div class="BarangayCertificateEmail">
                            <label style="color:black;">Email</label>
                            <input type="email" value="${email}" style="color: black;">
                        </div>
                        <div class="quantities">
                            <p style="color:black;">Quantity</p>
                            <input type="number" min="1" value="${data.quantity}" style="color: black;">
                        </div>
                    </div>
                    <div class="BarangayCertificate-fourth-section">
                        <div class="purpose">
                            <label style="color:black;">Purpose</label>
                            <select style="color: black;">
                                <option value="${data.purpose}">${data.purpose}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="btn">
                    <button id="approved-req">Approve</button>
                    <button id="reject-req">Reject</button>
                </div>
            `;

            Swal.fire({
                html: swalContent,
                didOpen: () => {
                    const inputs = Swal.getPopup().querySelectorAll('input, select');
                    
                    // Set all inputs to readonly by default
                    inputs.forEach((input) => {
                        input.setAttribute('readonly', 'readonly');
                        input.style.pointerEvents = 'none'; // Disable pointer events to prevent interactions
                    });
            
                    // Allow editing on double-click
                    inputs.forEach((input) => {
                        input.addEventListener('dblclick', (e) => {
                            e.stopPropagation(); // Prevent propagation
                            input.removeAttribute('readonly'); // Enable editing
                            input.style.pointerEvents = 'auto'; // Allow pointer events
                            
                            // Add a blur event to reset to readonly
                            input.addEventListener('blur', () => {
                                input.setAttribute('readonly', 'readonly');
                                input.style.pointerEvents = 'none'; // Disable pointer events again
                            });
                        });
                    });

                    const approveButton = document.getElementById("approved-req");
                    const rejectButton = document.getElementById("reject-req");


        
                    const sendData = (action) => {

                        const loadingSwal = Swal.fire({
                            allowOutsideClick: false, // Prevent closing by clicking outside
                            showConfirmButton: false, // Hide the confirm button
                            willOpen: () => {
                                Swal.showLoading(); // Show the loading spinner
                            },
                        });
                      fetch("/accept-user-request", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ action, email, requestId, requestType }),
                      })
                      .then(response => {
                        if (response.ok) {
                            loadingSwal.close();
                            Swal.fire({
                                title: `Request ${action === 'Approved' ? 'Approved' : 'Rejected'}`,
                                text: `The request has been successfully ${action === 'Approved' ? 'approved' : 'rejected'}.`,
                                icon: "success",
                                showConfirmButton: true, // Display confirm button
                                confirmButtonColor: 'rgb(22, 21, 21)',
                                confirmButtonText: "Ok", // Text for the confirm button
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  location.reload(); // Refresh the page when confirmed
                                }
                              });
                        } else {
                          Swal.fire({
                            title: "Error",
                            text: `Failed to ${action === 'Approved' ? 'Approved' : 'Rejected'} the request.`,
                            icon: "error",
                          });
                        }
                      });
                    };
        
                    // Event listeners for buttons
                    approveButton.addEventListener("click", () => {
                      sendData("Approved"); // Send data to the backend with 'approve' action
                    });
        
                    rejectButton.addEventListener("click", () => {
                      sendData("Rejected"); // Send data to the backend with 'reject' action
                    });



                },
                customClass: {
                    popup: 'BarangayCertificate-swal-container'
                },
                showConfirmButton: false
            });

          })
          .catch(error => {
            console.error("Error fetching request details:", error);
            Swal.fire({
              title: "Error",
              text: "Failed to fetch request details.",
              icon: "error",
            });
          });
      });
    });
  });
  


  document.addEventListener('DOMContentLoaded', () => {
    const generateFileIcons = document.querySelectorAll('.generate-file'); // Select all "generate file" icons
  
    generateFileIcons.forEach(icon => {
      icon.addEventListener('click', (event) => {
        const parentContainer = event.currentTarget.closest('.each-user-conts'); // Get the parent container
        const email = parentContainer.getAttribute('data-email'); // Retrieve the data-email attribute
        const type = parentContainer.getAttribute('data-type'); // Retrieve the data-type attribute
        const id = parentContainer.getAttribute('data-id'); // Retrieve the data-id attribute
  
        // Send the data to the backend
        fetch('/generate-file', { // Your backend endpoint for generating files
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, type, id }), // Convert data to JSON
        })
        .then(response => response.json())
        .then(data => {
          if (data.url) {
            // Open the provided URL in a new tab
            window.open(data.url, '_blank'); // '_blank' opens in a new tab
          } else {
            console.error('No URL provided in response');
          }
        })
        .catch(error => {
          console.error('Error generating file:', error);
        });
      });
    });
  });
  



  document.addEventListener("DOMContentLoaded", () => {
    const viewButtons = document.querySelectorAll(".each-user-conts .complete-or-rejected"); // All view buttons
  
    viewButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const parentContainer = event.currentTarget.closest(".each-user-conts"); // Get the parent container
        const email = parentContainer.getAttribute("data-email");
        const requestId = parentContainer.getAttribute("data-id");
        const requestType = parentContainer.getAttribute("data-type");
  
        // Send data to the backend to fetch the corresponding request
        fetch("/get-request-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, requestId, requestType }), // Send the data attributes to the backend
        })
          .then(response => response.json()) // Parse the JSON response
          .then(data => {

            console.log(data)
            // Display the request details in the Swal alert
            const nameParts = data.name.split(' ');

            let firstName = '';
            let middleName = '';
            let lastName = '';
        
            // Determine middle name based on the presence of a period
            const middleNameIndex = nameParts.findIndex((part) => part.includes('.'));
        
            if (middleNameIndex >= 0) {
                middleName = nameParts[middleNameIndex].replace('.', ''); // Remove the period
                firstName = nameParts.slice(0, middleNameIndex).join(' '); // Everything before middle name
                lastName = nameParts.slice(middleNameIndex + 1).join(' '); // Everything after middle name
            } else {
                // No middle name, assume first name and last name
                firstName = nameParts[0];
                lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
            }
        
            console.log(`First Name: ${firstName}`);
            console.log(`Middle Name: ${middleName}`);
            console.log(`Last Name: ${lastName}`);
            // Change the title based on dataType
            const formTitle = {
                Clearance: 'Barangay Clearance',
                Certificate: 'Barangay Certificate',
                Indigency: 'Barangay Indigency',
                Business: 'Business Certificate',
            };

            const swalContent = `
                <div class="BarangayCertificate-conts">
                    <div class="first-section" style="border-top: 10px solid black;">
                        <h2 style="color:black;">${formTitle[requestType]}</h2>
                        <p>Resident data is recorded here</p>
                    </div>
                    <div class="second-section">
                        <p id="title" style="color:black;">Full name</p>
                        <div class="full-name">
                            <div class="firstName">
                                <p>First Name</p>
                                <div class="input-container inputs">
                                    <input type="text" value="${firstName}" style="color: black;">
                                </div>
                            </div>
                            <div class="middleName">
                                <p>Middle Name</p>
                                <div class="input-container inputs">
                                    <input type="text" value="${middleName}" style="color: black;">
                                </div>
                            </div>
                            <div class="lastName">
                                <p>Last Name</p>
                                <div class="input-container inputs">
                                    <input type="text" value="${lastName}" style="color: black;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="BarangayCertificate-third-section">
                        <div class="phoneNumber">
                            <label style="color:black;">Phone Number</label>
                            <input type="text" value="${data.number}" style="color: black;">
                        </div>
                        <div class="BarangayCertificateEmail">
                            <label style="color:black;">Email</label>
                            <input type="email" value="${email}" style="color: black;">
                        </div>
                        <div class="quantities">
                            <p style="color:black;">Quantity</p>
                            <input type="number" min="1" value="${data.quantity}" style="color: black;">
                        </div>
                    </div>
                    <div class="BarangayCertificate-fourth-section">
                        <div class="purpose">
                            <label style="color:black;">Purpose</label>
                            <select style="color: black;">
                                <option value="${data.purpose}">${data.purpose}</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
            Swal.fire({
                html: swalContent,
                didOpen: () => {
                    const inputs = Swal.getPopup().querySelectorAll('input, select');
                    
                    // Set all inputs to readonly by default
                    inputs.forEach((input) => {
                        input.setAttribute('readonly', 'readonly');
                        input.style.pointerEvents = 'none'; // Disable pointer events to prevent interactions
                    });
            
                    // Allow editing on double-click
                    inputs.forEach((input) => {
                        input.addEventListener('dblclick', (e) => {
                            e.stopPropagation(); // Prevent propagation
                            input.removeAttribute('readonly'); // Enable editing
                            input.style.pointerEvents = 'auto'; // Allow pointer events
                            
                            // Add a blur event to reset to readonly
                            input.addEventListener('blur', () => {
                                input.setAttribute('readonly', 'readonly');
                                input.style.pointerEvents = 'none'; // Disable pointer events again
                            });
                        });
                    });
                },
                customClass: {
                    popup: 'BarangayCertificate-swal-container'
                },
                showConfirmButton: false
            });

          })
          .catch(error => {
            console.error("Error fetching request details:", error);
            Swal.fire({
              title: "Error",
              text: "Failed to fetch request details.",
              icon: "error",
            });
          });
      });
    });
  });