document.addEventListener('DOMContentLoaded', function() {
    // Get references to the service sections
    const requestChoice = document.getElementById('requestChoice');
    const appointmentChoice = document.getElementById('appointmentChoice');
    const complaintChoice = document.getElementById('complaintChoice');
  
    // Function to hide all sections
    const hideAllSections = () => {
      requestChoice.style.display = 'none';
      appointmentChoice.style.display = 'none';
      complaintChoice.style.display = 'none';
    };
  
    // Function to show a specific section based on the given choice
    const showSection = (sectionName) => {
      hideAllSections(); // Hide all sections first
      if (sectionName === 'requests') {
        requestChoice.style.display = 'block';
      } else if (sectionName === 'appointments') {
        appointmentChoice.style.display = 'block';
      } else if (sectionName === 'complaints') {
        complaintChoice.style.display = 'block';
      }
    };
  
    // Retrieve the last selected option from localStorage
    const lastSelectedOption = localStorage.getItem('lastServiceChoice') || 'requests'; // Default to 'requests'
  
    // Show the section based on the last selected option
    showSection(lastSelectedOption);
  
    // Add event listener to the select element
    const selectInput = document.getElementById('selectInput');
    selectInput.value = lastSelectedOption; // Set the select input to the last selected value
  
    selectInput.addEventListener('change', function() {
      const selectedOption = this.value; // Get the selected option from the dropdown
      showSection(selectedOption); // Show the section based on the selected option
  
      // Store the selected option in localStorage
      localStorage.setItem('lastServiceChoice', selectedOption);
    });
  });
  

document.addEventListener('DOMContentLoaded', function() {
    const statusColorMap = {
        pending: '#f4ce74',
        approved: '#4ec0fe',
        completed: '#1e8439',
        processing: '#dcc600',
        rejected: '#2e2f2f',
        cancelled: "rgb(149, 27, 27)",
        acknowledged: '#4ec0fe',
        resolved: '#1e8439',


      };
      
      // Get all elements with class 'online-status-conts'
      const statusElements = document.querySelectorAll('.status-div');
      
      statusElements.forEach((element) => {
        const status = element.textContent.trim().toLowerCase(); // Get the inner text and convert to lowercase
        const color = statusColorMap[status]; // Retrieve the corresponding color from the map
      
        if (color) {
          element.style.backgroundColor = color; // Apply the background color
          element.style.color = 'white';
      
        } else {
          console.warn(`No color defined for status: ${status}`); // Handle undefined status
        }
      });
});



document.addEventListener('DOMContentLoaded', () => {
    const viewIcons = document.querySelectorAll('.actions ion-icon[data-icon="view-my-request"]');
    const editIcons = document.querySelectorAll('.actions ion-icon[data-icon="edit-my-request"]');
    const cancelIcons = document.querySelectorAll('.actions ion-icon[data-icon="cancel-my-request"]');
    const deleteIcons = document.querySelectorAll('.actions ion-icon[data-icon="delete-my-request"]');

    const viewMyAppointment = document.querySelectorAll('.actions ion-icon[data-icon="view-my-appointment"]');
    const deleteAppointment = document.querySelectorAll('.actions ion-icon[data-icon="delete-my-appointment"]');

    const viewComplaints = document.querySelectorAll('.actions ion-icon[data-icon="view-my-complaint"]');
    const editComplaints = document.querySelectorAll('.actions ion-icon[data-icon="edit-my-complaint"]');
    const deleteComplaints = document.querySelectorAll('.actions ion-icon[data-icon="delete-my-complaint"]');
    const cancelComplaints = document.querySelectorAll('.actions ion-icon[data-icon="cancel-my-complaint"]');

    

    




    // View action
    viewIcons.forEach((icon) => {
        icon.addEventListener('click', async () => {
            const requestId = icon.closest('.requested-tables').id;
            const dataType = icon.closest('.requested-tables').getAttribute('data-type');
            
            
            try {
                const response = await fetch(`/getViewData?id=${requestId}&dataType=${dataType}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const requestData = await response.json();
                    const email = requestData.email;

                    const requestedData = requestData.Type_of_request?.[dataType]?.find((item) => item.id === requestId);

                    if (requestedData) {
                        // Split name into first, middle, last
                        const nameParts = requestedData.name.split(' ');

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
                            <div class="BarangayCertificate-conts requestDoc">
                                <div class="first-section" style="border-top: 10px solid black;">
                                    <h2 style="color:black;">${formTitle[dataType]}</h2>
                                    <p>All of your fill-up is recorded here</p>
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
                                        <div class="input-container inputs">
                                        <input type="text" value="${requestedData.number}" style="color: black;">
                                        </div>
                                    </div>
                                    <div class="BarangayCertificateEmail">
                                        <label style="color:black;">Email</label>
                                        <div class="input-container inputs">
                                        <input type="email" value="${email}" style="color: black;">
                                        </div>
                                    </div>
                                    <div class="quantities">
                                        <p style="color:black;">Quantity</p>
                                        <div class="input-container inputs">
                                        <input type="number" min="1" value="${requestedData.quantity}" style="color: black;">
                                        </div>
                                    </div>
                                </div>
                                <div class="BarangayCertificate-fourth-section">
                                    <div class="purpose">
                                        <label style="color:black;">Purpose</label>
                                        <div class="input-container inputs">
                                        <select style="color: black;">
                                            <option value="${requestedData.purpose}">${requestedData.purpose}</option>
                                        </select>
                                        </div>
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
                            confirmButtonText: 'Return', // Change the text of the OK button
                            confirmButtonColor: 'rgb(22, 21, 21)', // Change the color of the OK button
                            showConfirmButton: true,
                        });

                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Requested data not found.',
                            icon: 'error',
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to retrieve request data. Please try again later.',
                        icon: 'error',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while retrieving request data. Please try again later.',
                    icon: 'error',
                });
            }
        });
    });

    // Edit action
    editIcons.forEach((icon) => {
        icon.addEventListener('click', async () => {
            const requestId = icon.closest('.requested-tables').id;
            const dataType = icon.closest('.requested-tables').getAttribute('data-type');
            
            
            try {
                const response = await fetch(`/getViewData?id=${requestId}&dataType=${dataType}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const requestData = await response.json();
                    const email = requestData.email;

                    const requestedData = requestData.Type_of_request?.[dataType]?.find((item) => item.id === requestId);

                    if (requestedData.status === "Pending"){

                    if (requestedData) {
                        // Split name into first, middle, last
                        const nameParts = requestedData.name.split(' ');

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
                            <div class="BarangayCertificate-conts requestDoc">
                                <div class="first-section" style="border-top: 10px solid black;">
                                    <h2 style="color:black;">${formTitle[dataType]}</h2>
                                    <p>All of your fill-up is recorded here</p>
                                </div>
                                <div class="second-section">
                                    <p id="title" style="color:black;">Full name</p>
                                    <div class="full-name">
                                        <div class="firstName">
                                            <p>First Name</p>
                                            <div class="input-container inputs">
                                                <input type="text" value="${firstName}" style="color: black;">
                                            </div>
                                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                        </div>
                                        <div class="middleName">
                                            <p>Middle Name</p>
                                            <div class="input-container inputs">
                                                <input type="text" value="${middleName}" style="color: black;">
                                            </div>
                                            <div class="option-message"><ion-icon name="alert-circle-outline"></ion-icon>Optional</div>
                                        </div>
                                        <div class="lastName">
                                            <p>Last Name</p>
                                            <div class="input-container inputs">
                                                <input type="text" value="${lastName}" style="color: black;">
                                            </div>
                                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="BarangayCertificate-third-section">
                                    <div class="phoneNumber">
                                        <label style="color:black;">Phone Number</label>
                                        <div class="input-container inputs">
                                        <input type="number" min="11" value="${requestedData.number}" style="color: black;" required pattern="\d*">
                                        </div>
                                        <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                    </div>
                                    <div class="BarangayCertificateEmail">
                                        <label style="color:black;">Email</label>
                                        <div class="input-container inputs">
                                        <input type="email" value="${email}" style="color: black;" readonly>
                                        </div>
                                        <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                    </div>
                                    <div class="quantities">
                                        <p style="color:black;">Quantity</p>
                                        <div class="input-container inputs">
                                        <input type="number" min="1" value="${requestedData.quantity}" style="color: black;">
                                        </div>
                                        <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                    </div>
                                </div>
                                <div class="BarangayCertificate-fourth-section">
                                    <div class="purpose">
                                        <label style="color:black;">Purpose</label>
                                        <div class="input-container inputs">
                                        <select style="color: black;" id="Purpose">
                                            <option value="${requestedData.purpose}">${requestedData.purpose}</option>
                                            <option value="Medical Assistance">Medical Assistance</option>
                                            <option value="Financial Assistance">Financial Assistance</option>
                                            <option value="Educational Assistance">Educational Assistance</option>
                                            <option value="Burial Assistance">Burial Assistance</option>
                                            <option value="Employment Assistance">Employment Assistance</option>
                                            <option value="General Purpose">General Purpose</option>
                                        </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="submit-section"  style="background-color: transparent;">
                                    <button type="submit" class="submit-verify" id="submit-edit">Update</button> 
                                </div>

                            </div>
                        `;

                        Swal.fire({
                            html: swalContent,
                            didOpen: () => {

                                handleMiddleName();
                                handleSelect();

                                function handleSelect() {
                                    const selectInputs = document.querySelectorAll('.BarangayCertificate-fourth-section select');
                                    const selectMessage = document.querySelector('.BarangayCertificate-fourth-section .require-message');
                                
                                    selectInputs.forEach(input => {
                                        input.addEventListener('click', () => {
                                            selectMessage.style.visibility = "hidden";
                                        });
                                    });
                                }

                                function toggleMessage(input, messageElement, isOptional, optionalMessageElement) {
                                    if (!isOptional) {
                                        // For required fields
                                        if (input.value.trim() === "") {
                                            messageElement.style.visibility = "visible";
                                        } else {
                                            messageElement.style.visibility = "hidden";
                                        }
                                    } else {
                                        // For optional fields
                                        if (input.value.trim() === "") {
                                            messageElement.style.visibility = "visible";
                                            if (optionalMessageElement) {
                                                optionalMessageElement.style.visibility = "hidden";
                                            }
                                        } else {
                                            messageElement.style.visibility = "hidden";
                                            if (optionalMessageElement) {
                                                optionalMessageElement.style.visibility = "hidden";
                                            }
                                        }
                                    }
                                }
                            
                                // Get all input elements
                                const inputs = document.querySelectorAll('.inputs input, .options input');
                            
                                // Loop through each input element
                                inputs.forEach(input => {
                                    // Get the parent div of the input
                                    const inputDiv = input.parentElement.parentElement;
                                    // Get the message element corresponding to the input
                                    const messageElement = inputDiv.querySelector('.require-message');
                                    // Check if the input is optional
                                    const isOptional = inputDiv.querySelector('.option-message') !== null;
                                    // Get the optional message element if it exists
                                    const optionalMessageElement = inputDiv.querySelector('.option-message');
                            
                                    // Add event listener for input focus
                                    input.addEventListener('focus', () => {
                                        // Hide the message element on focus
                                        messageElement.style.visibility = "hidden";
                                        if (isOptional && optionalMessageElement) {
                                            optionalMessageElement.style.visibility = "visible";
                                        }
                                    });
                            
                                    // Add event listener for input blur
                                    input.addEventListener('blur', () => {
                                        // Show or hide the message element based on input value
                                        toggleMessage(input, messageElement, isOptional, optionalMessageElement);
                                    });
                            
                                    // Add event listener for input typing
                                    input.addEventListener('input', () => {
                                        // Hide the message element when user starts typing
                                        messageElement.style.visibility = "hidden";
                                        if (isOptional && optionalMessageElement) {
                                            optionalMessageElement.style.visibility = "hidden";
                                        }
                                    });
                                });

                                const submitButtons = document.querySelector('.submit-verify');
    
                                // Add event listener for submit button click
                                submitButtons.addEventListener('click', (event) => {
                                    // Prevent default form submission behavior
                                    event.preventDefault();
                                    // Validate form before submission
                                    const formIsValid = validateForm();
                                    if (formIsValid) {
                                        console.log("Successfully Submitted");
                                       
                                    }
                                });
                            
                                // Function to validate form before submission
                                function validateForm() {
                                    let isValid = true;
                                    inputs.forEach(input => {
                                        const inputDiv = input.parentElement.parentElement;
                                        const messageElement = inputDiv.querySelector('.require-message');
                                        const isOptional = inputDiv.querySelector('.option-message') !== null;
                                        if (!isOptional && input.value.trim() === "") {
                                            messageElement.style.visibility = "visible";
                                            isValid = false;
                                        }
                                    });
                                    return isValid;
                                }
                            

                                function handleMiddleName() {
                                    const middleNameInput = document.querySelector('.middleName input');
                                    const middleNameMessage = document.querySelector('.middleName .require-message');
                                    const middleNameOptionalMessage = document.querySelector('.middleName .option-message');
                                
                                    middleNameInput.addEventListener('focus', () => {
                                        if (middleNameOptionalMessage) {
                                            middleNameOptionalMessage.style.visibility = "visible";
                                        }
                                    });
                                
                                    middleNameInput.addEventListener('blur', () => {
                                        toggleMessage(middleNameInput, middleNameMessage, true, middleNameOptionalMessage);
                                    });
                                
                                    middleNameInput.addEventListener('input', () => {
                                        middleNameMessage.style.visibility = "hidden";
                                        if (middleNameOptionalMessage) {
                                            middleNameOptionalMessage.style.visibility = "hidden";
                                        }
                                    });
                                }





                                // Add border blue if user is in the section
                                const sections = document.querySelectorAll('.BarangayCertificate-conts > div');

                                // Add event listeners to inputs and select elements in each section
                                sections.forEach(section => {
                                    const inputsAndSelects = section.querySelectorAll('input, select');
                                    inputsAndSelects.forEach(element => {
                                        element.addEventListener('focus', () => {
                                            // Remove highlighting from all sections
                                            sections.forEach(section => {
                                                section.style.borderLeft = ''; // Remove any existing left border
                                            });
                                
                                            // Add border style to the left side of the current section
                                            section.style.borderLeft = '5px solid rgb(220, 167, 7)'; // Add left border
                                        });
                                    });
                                });
                                

                                // Submit button click event listener
                                const submitBtn = document.getElementById('submit-edit');
                                submitBtn.addEventListener('click', function () {
                                    // Check if all inputs are filled

                                    // Retrieve email
                                    const email = document.querySelector('.BarangayCertificateEmail input[type="email"]').value;

                                    // Retrieve name
                                    const firstName = document.querySelector('.firstName input').value;
                                    const middleName = document.querySelector('.middleName input').value;
                                    const lastName = document.querySelector('.lastName input').value;
                                    const name = `${firstName} ${middleName}. ${lastName}`;

                                    // Retrieve phone number
                                    const phoneNumber = document.querySelector('.phoneNumber input').value;

                                    // Retrieve quantity
                                    const quantity = document.querySelector('.quantities input').value;

                                    // Retrieve purpose
                                    const purpose = document.getElementById('Purpose').value;

                                    if (!email || !firstName || !lastName || !phoneNumber || !quantity || !purpose) {
                                        validateForm();
                                        return;
                                    }

                                    // Prepare data object
                                    const data = {
                                        email,
                                        information: {
                                            requestId,
                                            dataType,
                                            name,
                                            phoneNumber,
                                            quantity,
                                            purpose,
                                        },
                                    };

                                    console.log("Data to be sent:", data);

                                    Swal.fire({
                                        title: "Are you sure?",
                                        text: "Do you really want to update this request?",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: 'rgb(22, 21, 21)',
                                        confirmButtonText: "Yes, update",
                                        cancelButtonText: "No, cancel",
                                    }).then(async (result) => {
                                        if (result.isConfirmed) {
                                            try {
                                                const response = await fetch("/editData", {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify(data),
                                                });
                                
                                                if (response.ok) {
                                                    Swal.fire({
                                                        title: "Update Successful!",
                                                        text: "The request has been updated successfully.",
                                                        icon: "success",
                                                        showConfirmButton: true, // Display confirm button
                                                        confirmButtonText: 'OK', // Customize confirm button text
                                                        confirmButtonColor: 'rgb(22, 21, 21)',
                                                    });
                                                } else {
                                                    throw new Error("Failed to update request.");
                                                }
                                            } catch (error) {
                                                console.error("Error updating request:", error);
                                                Swal.fire({
                                                    title: "Error",
                                                    text: "An error occurred while updating the request. Please try again later.",
                                                    icon: "error",
                                                });
                                            }
                                        }
                                    });


                                });


                            },
                            customClass: {
                                popup: 'BarangayCertificate-swal-container'
                            },
                            showConfirmButton: false,
                        });

                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Requested data not found.',
                            icon: 'error',
                        });
                    }
                } else{
                    Swal.fire({
                        title: 'Request cannot be edited',
                        text: 'Pending request can only be edit.',
                        icon: 'error',
                    });
                }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to retrieve request data. Please try again later.',
                        icon: 'error',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while retrieving request data. Please try again later.',
                    icon: 'error',
                });
            }
        });
    });

    // Cancel action
    cancelIcons.forEach((icon) => {
        icon.addEventListener('click', async () => {
            const requestId = icon.closest('.requested-tables').id;
            const dataType = icon.closest('.requested-tables').getAttribute('data-type');
    
            try {
                const response = await fetch(`/getViewData?id=${requestId}&dataType=${dataType}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (response.ok) {
                    const requestData = await response.json();
                    const requestedData = requestData.Type_of_request?.[dataType]?.find((item) => item.id === requestId);
    
                    if (requestedData.status !== 'Processing') {
                        // If the request is not in "Process", ask for confirmation
                        Swal.fire({
                            title: 'Cancel Request?',
                            text: 'Are you sure you want to cancel this request?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: 'rgb(22, 21, 21)',
                            confirmButtonText: 'Yes, cancel it!',
                            cancelButtonText: 'No, keep it',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // If user confirms cancellation
                                fetch(`/cancel-request`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ requestId, dataType }), // Send the data to the backend
                                })
                                    .then((response) => {
                                        if (response.ok) {
                                            Swal.fire({
                                                title: 'Request Cancelled!',
                                                text: 'The request has been cancelled successfully.',
                                                icon: 'success',
                                                showConfirmButton: true, // Display confirm button
                                                confirmButtonText: 'OK', // Customize confirm button text
                                                confirmButtonColor: 'rgb(22, 21, 21)', // Custom text for the confirmation button
                                            }).then((result) => {
                                                if (result.isConfirmed) { // Check if the user confirmed the alert
                                                    location.reload(); // Reload the page
                                                }
                                            })

                                        } else {
                                            throw new Error('Failed to cancel the request.');
                                        }
                                    })
                                    .catch((error) => {
                                        console.error('Error cancelling the request:', error);
                                        Swal.fire({
                                            title: 'Error',
                                            text: 'An error occurred while cancelling the request.',
                                            icon: 'error',
                                        });
                                    });
                            }
                        });
                    } else {
                        // If the request is in "Process", cannot be cancelled
                        Swal.fire({
                            title: 'Request cannot be cancelled',
                            text: 'Requests with appointments cannot be cancelled.',
                            icon: 'error',
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to retrieve request data. Please try again later.',
                        icon: 'error',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while retrieving request data. Please try again later.',
                    icon: 'error',
                });
            }
        });
    });
    deleteIcons.forEach((icon) => {
        icon.addEventListener('click', async () => {
            const requestId = icon.closest('.requested-tables').id; // Get the request ID
            const dataType = icon.closest('.requested-tables').getAttribute('data-type'); // Get the data type

            // Show a confirmation popup before proceeding
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you really want to delete this request?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: 'rgb(22, 21, 21)',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it',
            });

            if (result.isConfirmed) { // If the user confirms
                try {
                    const response = await fetch('/delete-request', { // URL to your backend endpoint
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ requestId, dataType }), // Send the request ID and data type to the backend
                    });

                    if (response.ok) { // If the backend responds with success
                        Swal.fire({
                            title: 'Request Deleted!',
                            text: 'The request has been deleted successfully.',
                            icon: 'success',
                        }).then(() => {
                            location.reload(); // Reload the page when the user clicks OK
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'An error occurred while deleting the request.',
                            icon: 'error',
                        });
                    }
                } catch (error) {
                    console.error('Error deleting request:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'An error occurred. Please try again later.',
                        icon: 'error',
                    });
                }
            } // end of result.isConfirmed
        }); // end of event listener
    }); // end of forEach


    viewMyAppointment.forEach((icon) => {
        icon.addEventListener('click', async () => {
            const dataAppointmentCode = icon.closest('.requested-tables').getAttribute('data-appointmentcode');
            const dataId = icon.closest('.requested-tables').getAttribute('data-id');
    
            const requestData = {
                appointmentCode: dataAppointmentCode,
                id: dataId,
            };
    
            try {
                const response = await fetch('/get-appointment-details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData), // Send data to backend
                });
    
                if (response.ok) {
                    const responseData = await response.json(); // Get the data from the backend
                    const appointment = responseData.appointment;
                    const matchingRequest = responseData.request;

                    let documentType;
                                
                    const formattedDate = new Intl.DateTimeFormat('en-US', {
                        month: 'long', // Display full month name
                        day: 'numeric', // Display numeric day
                        year: 'numeric', // Display 4-digit year
                    }).format(new Date(matchingRequest.createdAt));

                    // Check if the appointment type matches any of the specified types
                    if (['Clearance', 'Indigency', 'Certificate', 'Business'].includes(appointment.appointmentType)) {
                        documentType = 'Document Request'; 
                        let requestType; // Declare the variable to hold document type

                        if (['Clearance', 'Indigency', 'Certificate'].includes(appointment.appointmentType)) {
                            requestType = 'Barangay'; // Set to 'Document Request' if it matches
                        } else {
                            requestType = 'Business'; // Set to 'Unknown' if it doesn't match
                        }

                        Swal.fire({
                            html:
                            `
                            <div class="document-request-conts">
                                <div class="heading">Document Information</div>
                                <div class="content">
                                    <div>
                                        <div class="bold">
                                            Appointment-code:
                                        </div>
                                        <div class="normal">
                                        ${appointment.appointmentCode}
                                        </div>
                                    </div>
                                    <hr style="height: 2px;">
                                    <br>
                                    <br>
                                    <div>
                                        <div class="bold" >
                                            Name:
                                        </div>
                                        <div class="normal">
                                        ${matchingRequest.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="bold">
                                            Appointment Type:
                                        </div>
                                        <div class="normal">
                                            ${documentType}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="bold">
                                            Request Type:
                                        </div>
                                        <div class="normal">
                                        ${requestType+" "+appointment.appointmentType }
                                        </div>
                                    </div>
                                    <div>
                                        <div class="bold">
                                            Quantity:
                                        </div>
                                        <div class="normal">
                                        ${matchingRequest.quantity}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="bold">
                                            Purpose:
                                        </div>
                                        <div class="normal">
                                        ${matchingRequest.purpose}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="bold">
                                            Data requested:
                                        </div>
                                        <div class="normal">
                                            ${formattedDate}
                                        </div>
                                    </div>
                                </div>
                                <div class="view-button-appointments">
                                    <button id="cancel-appointment">Cancel appointment</button>
                                </div>
                            </div>
                
                            `,
                            customClass: {
                                popup: 'Document-request-swal', // This will apply your custom class
                            },
                            showConfirmButton: false,
                            allowOutsideClick: true, // Allows clicking outside to close
                            hideClass: {
                                popup: 'my-fade-out', // Custom fade-out animation
                            },
                            didOpen: function() {

                                
                                const cancelButton = document.getElementById('cancel-appointment');

                                console.log(appointment, matchingRequest)

                            

                                // Event listener for canceling appointment
                                cancelButton.addEventListener('click', () => {
                                  Swal.fire({
                                    title: 'Cancel Appointment?',
                                    text: 'Are you sure you want to cancel this appointment?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes',
                                    cancelButtonText: 'No',
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      fetch('/update-appointment-status', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          action: 'Cancelled', // Action being performed
                                          appointment,
                                          matchingRequest,
                                        }),
                                      })
                                      .then(response => response.json())
                                      .then((data) => {
                                        if (data.success) {
                                            Swal.fire({
                                                title: 'Success!',
                                                text: 'Appointment marked as complete.',
                                                icon: 'success',
                                              }).then(() => {
                                                location.reload(); // Reload the page after the user confirms
                                              });
                                        } else {
                                          Swal.fire({
                                            title: 'Error',
                                            text: 'Failed to cancel the appointment.',
                                            icon: 'error',
                                          });
                                        }
                                      });
                                    }
                                  });
                                });
                            }
                        });

                    } else if(appointment.appointmentType ==="Complaint"){
                        
                    }



                } else {
                    throw new Error('Failed to fetch appointment details');
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while fetching appointment details.',
                    icon: 'error',
                });
            }
        });
    });

    deleteAppointment.forEach((icon) => {
        icon.addEventListener('click', async () => {
            const dataAppointmentCode = icon.closest('.requested-tables').getAttribute('data-appointmentcode');

            // Show a confirmation popup before proceeding
            const result = await Swal.fire({
                title: 'Delete appointment?',
                text: 'Do you really want to delete this appointment?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: 'rgb(22, 21, 21)',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it',
            });

            if (result.isConfirmed) { // If the user confirms
                try {
                    const response = await fetch('/delete-appointment', { // URL to your backend endpoint
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ dataAppointmentCode}), // Send the request ID and data type to the backend
                    });

                    if (response.ok) { // If the backend responds with success
                        Swal.fire({
                            title: 'Appointment Deleted!',
                            text: 'The Appointment has been deleted successfully.',
                            icon: 'success',
                            showConfirmButton: true, // Display confirm button
                            confirmButtonText: 'OK', // Customize confirm button text
                            confirmButtonColor: 'rgb(22, 21, 21)',
                        }).then(() => {
                            location.reload(); // Reload the page when the user clicks OK
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'An error occurred while deleting the request.',
                            icon: 'error',
                        });
                    }
                } catch (error) {
                    console.error('Error deleting request:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'An error occurred. Please try again later.',
                        icon: 'error',
                    });
                }
            } // end of result.isConfirmed
        }); // end of event listener
    }); // end of forEach

    viewComplaints.forEach((icon) => {
        icon.addEventListener('click', function() {
          // Find the parent element that contains the data-allInfo attribute
          const parentElement = icon.closest('.requested-tables');
    
          if (parentElement) {
            // Retrieve the data-allInfo attribute and parse it into an object
            const allInfo = JSON.parse(parentElement.getAttribute('data-allInfo'));
    
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
                            ${allInfo.category}
                            </div>
                        </div>
                        <hr style="height: 2px; background-color: black;">
                        <div>
                            <div class="bold" >
                                First Name:
                            </div>
                            <div class="normal">
                            ${allInfo.firstName}
                            </div>
                        </div>
                        <div>
                            <div class="bold">
                                Last Name:
                            </div>
                            <div class="normal">
                            ${allInfo.lastName}
                            </div>
                        </div>
                        <div>
                            <div class="bold">
                                Phone Number:
                            </div>
                            <div class="normal">
                            ${allInfo.phoneNumber}
                            </div>
                        </div>
                        <div>
                            <div class="bold">
                                Data issue:
                            </div>
                            <div class="normal">
                            ${new Date(allInfo.dateOfComplaint).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                        </div>
                        <div class="cmplt-description">
                            <div class="bold">
                                Details:
                            </div>
                            <div class="normal">
                            ${allInfo.description}
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
            console.warn('Parent element not found for icon.');
          }
        });
    });

    editComplaints.forEach((icon) => {
        icon.addEventListener('click', () => {
          // Retrieve the complaint status from the data attribute
          const parentElement = icon.closest('.requested-tables');
          const dataEmail = icon.closest('.requested-tables').getAttribute('data-email');
          const dataId = icon.closest('.requested-tables').getAttribute('data-id');
    

            const allInfo = JSON.parse(parentElement.getAttribute('data-allInfo'));

          // If the status is not "Pending", display an error message
          if (allInfo.status !== 'Pending') {
            Swal.fire({
              title: 'Edit Not Allowed!',
              text: 'Only complaints with a "Pending" status can be edited.',
              icon: 'error',
              showConfirmButton: true, // Display confirm button
              confirmButtonText: 'OK', // Customize confirm button text
              confirmButtonColor: 'rgb(22, 21, 21)',
            });
            return; // Exit early since editing is not allowed
          }
      
          Swal.fire({
            html:
            `
            <div class="main-conts">
                <div class="complaint-form-title">
                    <h2>Write Complaint</h2>
                </div>
                <div class="form-description">
                    Update Complaint Form
                </div>
                <div class="form-content">
                    <div class="cmplt-each-cnts">
                        <div id="frst-name">
                            <p>First Name:</p>
                            <div class="inputs"><input type="text" placeholder="First Name" value="${allInfo.firstName}"></div>
                            <div  class="cmplt-message"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >
                        </div>
                        <div id="lst-name">
                            <p>Last Name:</p>
                            <div class="inputs"><input type="text" placeholder="Last Name"  value="${allInfo.lastName}"></div>
                            <div class="cmplt-message"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >
                        </div>
                    </div>
                    <div class="cmplt-each-cnts">
                        <div id="cmpltEmail">
                            <p>Email:</p>
                            <div class="inputs"><input type="text" placeholder="Email"  value="${dataEmail}" readonly></div>
                            <div class="cmplt-message"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >
                        </div>
                    </div>
                    <div class="cmplt-each-cnts">
                        <div id="cmpltEmail">
                            <p>Phone number:</p>
                            <div class="inputs"><input type="text" placeholder="Phone Number" value="${allInfo.phoneNumber}"></div>
                            <div class="cmplt-message"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >
                        </div>
                    </div>
                    <div class="cmplt-each-cnts">
                        <div id="cmpltCategory">
                            <p>Reason for Complaint:</p>
                            <div class="inputs">
                                <select>
                                    <option value="${allInfo.category}" style="color: #868686">${allInfo.category}</option> <!-- Default option -->
                                    <option value="Neigborhood Issue">Neigborhood Issue</option>
                                    <option value="vandalism">Vandalism</option>
                                    <option value="Garbage and Waste Management">Garbage and Waste Management</option>
                                    <option value="Traffic and Road Issues">Traffic and Road Issues</option>
                                    <option value="Public Nuisance">Public Nuisance</option>
                                    <option value="Domestic Disputes">Domestic Disputes</option>
                                    <option value="Boundary Disputes">Boundary Disputes</option>
                                    <option value="Illegal Construction">Illegal Construction</option>
                                    <option value="Environmental Concerns">Environmental Concerns</option>
                                    <option value="Animal Control">Animal Control</option>
                                </select>
                            </div>
                            <div class="cmplt-message">
                                <ion-icon name="alert-circle-outline"></ion-icon><p>Required</p>
                            </div>
                        </div>
                    </div>
                    <div class="cmplt-each-cnts">
                        <div id="cmpltReason">
                            <p>Please provide any details:</p>
                            <div class="inputs">
                                <!-- Replace the single-line input with a multi-line textarea -->
                                <textarea rows="4" placeholder="Describe your complaint..." >${allInfo.description}</textarea>
                            </div>
                            <div class="cmplt-message">
                                <ion-icon name="alert-circle-outline"></ion-icon><p>Required</p>
                            </div>
                        </div>
                    </div>

                    <button id="submit-cmplt">Update</button> 
                </div>
                
                
            </div>
            `,
            customClass: {
                popup: 'complaint-style-swal', // This will apply your custom class
            },
            showConfirmButton: false,
            allowOutsideClick: true, // Allows clicking outside to close
            hideClass: {
                popup: 'my-fade-out', // Custom fade-out animation
            },
            didOpen: function() {
                const inputs = document.querySelectorAll(".inputs input, .inputs select, .inputs textarea");
                const messages = document.querySelectorAll(".cmplt-message"); // All messages

                // Function to show or hide the message based on input value
                const validateField = (input, message) => {
                if (input.value.trim() === "") {
                    message.classList.add("show"); // Show message if empty
                } else {
                    message.classList.remove("show"); // Hide message if filled
                }
                };

                // Add event listeners to validate fields on blur
                inputs.forEach((input, index) => {
                input.addEventListener("blur", () => validateField(input, messages[index]));
                });

                // Add event listener for submit
                document.getElementById("submit-cmplt").addEventListener("click", () => {
                let isValid = true;
                inputs.forEach((input, index) => {
                    if (input.value.trim() === "") {
                    isValid = false;
                    messages[index].classList.add("show"); // Show required message
                    } else {
                    messages[index].classList.remove("show"); // Hide required message
                    }
                });

                if (isValid) {
                    // Prepare data for backend submission
                    const data = {
                    firstName: inputs[0].value,
                    lastName: inputs[1].value,
                    email: inputs[2].value,
                    phoneNumber: inputs[3].value,
                    category: inputs[4].value,
                    description: inputs[5].value,
                    id: dataId
                    };

                    console.log(data);

                    // Send data to backend
                    fetch("/edit-complaint", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                    })
                    .then((response) => {
                        if (response.ok) {
                        Swal.fire({
                            title: "Update Complaint Success!",
                            text: "You successfully updated your complaint.",
                            icon: "success",
                            showConfirmButton: true, // Display confirm button
                            confirmButtonText: 'OK', // Customize confirm button text
                            confirmButtonColor: 'rgb(22, 21, 21)',

                        }).then(() => {
                            location.reload(); // Reload the page when the user clicks OK
                        });
                        
                        } else {
                        Swal.fire({
                            title: "Submission Failed",
                            text: "Something went wrong. Please try again.",
                            icon: "error",
                        });
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        Swal.fire({
                        title: "Submission Error",
                        text: "An unexpected error occurred.",
                        icon: "error",
                        });
                    });
                }
                });
            },
        });
    });

    cancelComplaints.forEach((icon) => {
        icon.addEventListener('click', async () => {
              const parentElement = icon.closest('.requested-tables'); // Get the parent element
              const dataEmail = parentElement.getAttribute('data-email'); // Get the email
              const dataId = parentElement.getAttribute('data-id'); // Get the complaint ID
                
              
              Swal.fire({
                title: 'Cancel Complaint?',
                text: 'Are you sure you want to cancel this complaint?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, cancel it!',
                cancelButtonText: 'No, keep it',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: 'rgb(22, 21, 21)',
              }).then(async (result) => {
                if (result.isConfirmed) { // If the user confirms cancellation
                  try {
                    const response = await fetch('/cancel-complaint', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email: dataEmail, id: dataId }), // Send email and ID to backend
                    });
        
                    if (response.ok) {
                      Swal.fire({
                        title: 'Cancelled!',
                        text: 'The complaint has been cancelled.',
                        icon: 'success',
                        showConfirmButton: true, // Display confirm button
                        confirmButtonText: 'OK', // Customize confirm button text
                        confirmButtonColor: 'rgb(22, 21, 21)',
                      }).then(() => {
                        location.reload(); // Reload the page when the user clicks OK
                    });
        
                    } else {
                      Swal.fire({
                        title: 'Error',
                        text: 'Failed to cancel the complaint. Please try again.',
                        icon: 'error',
                      });
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'An unexpected error occurred. Please try again later.',
                      icon: 'error',
                    });
                  }
                }
              });
            });
        });
    });
          
        deleteComplaints.forEach((icon) => {
            icon.addEventListener('click', function() {
                // Find the parent element that contains the data-allInfo attribute
                const parentElement = icon.closest('.requested-tables');
                const dataEmail = parentElement.getAttribute('data-email'); // Get email
                const dataId = parentElement.getAttribute('data-id'); // Get ID
          
                if (parentElement) {
                  // Retrieve the data-allInfo attribute and parse it into an object
                  const allInfo = JSON.parse(parentElement.getAttribute('data-allInfo'));
          
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
                                  ${allInfo.category}
                                  </div>
                              </div>
                              <hr style="height: 2px; background-color: black;">
                              <div>
                                  <div class="bold" >
                                      First Name:
                                  </div>
                                  <div class="normal">
                                  ${allInfo.firstName}
                                  </div>
                              </div>
                              <div>
                                  <div class="bold">
                                      Last Name:
                                  </div>
                                  <div class="normal">
                                  ${allInfo.lastName}
                                  </div>
                              </div>
                              <div>
                                  <div class="bold">
                                      Phone Number:
                                  </div>
                                  <div class="normal">
                                  ${allInfo.phoneNumber}
                                  </div>
                              </div>
                              <div>
                                  <div class="bold">
                                      Data issue:
                                  </div>
                                  <div class="normal">
                                  ${new Date(allInfo.dateOfComplaint).toLocaleDateString('en-US', {
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </div>
                              </div>
                              <div class="cmplt-description">
                                  <div class="bold">
                                      Details:
                                  </div>
                                  <div class="normal">
                                  ${allInfo.description}
                                  </div>
                              </div>
                              <div class="cmplt-description">
                              <div class="bold">
                                  Action taken:
                              </div>
                              <div class="normal">
                              ${allInfo.resolvedInformation}
                              </div>
                          </div>
                                    <button id="dlte-cmplt">Delete</button>
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

                  document.getElementById('dlte-cmplt').addEventListener('click', async function() {


                    try {
                        const response = await fetch('/delete-complaint', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: dataEmail, id: dataId }), // Send the email and ID to the backend
                        });
        
                        if (response.ok) {
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'The complaint has been deleted.',
                                icon: 'success',
                                showConfirmButton: true, // Display confirm button
                                confirmButtonText: 'OK', // Customize confirm button text
                                confirmButtonColor: 'rgb(22, 21, 21)',
                            }).then(() => {
                                location.reload(); // Reload the page when the user clicks OK
                            });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'Failed to delete the complaint. Please try again.',
                                icon: 'error',
                            });
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'An unexpected error occurred. Please try again later.',
                            icon: 'error',
                        });
                    }
                });




                } else {
                  console.warn('Parent element not found for icon.');
                }
              });
      
 
 /*
            icon.addEventListener('click', async () => {
                const parentElement = icon.closest('.requested-tables'); // Find the parent element
                const dataEmail = parentElement.getAttribute('data-email'); // Get email
                const dataId = parentElement.getAttribute('data-id'); // Get ID
                console.log("Click it");
                Swal.fire({
                  title: 'Delete Complaint?',
                  text: 'Are you sure you want to delete this complaint? This action cannot be undone.',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, delete it!',
                  cancelButtonText: 'Cancel',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: 'rgb(22, 21, 21)',
                }).then(async (result) => {
                  if (result.isConfirmed) { // If the user confirms the action
                        try {
                        const response = await fetch('/delete-complaint', {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: dataEmail, id: dataId }), // Send the email and ID to the backend
                        });
            
                        if (response.ok) {
                            Swal.fire({
                            title: 'Deleted!',
                            text: 'The complaint has been deleted.',
                            icon: 'success',
                            showConfirmButton: true, // Display confirm button
                            confirmButtonText: 'OK', // Customize confirm button text
                            confirmButtonColor: 'rgb(22, 21, 21)',
                            }).then(() => {
                                location.reload(); // Reload the page when the user clicks OK
                            });
            
                        } else {
                            Swal.fire({
                            title: 'Error',
                            text: 'Failed to delete the complaint. Please try again.',
                            icon: 'error',
                            });
                        }
                        } catch (error) {
                            console.error('Error:', error);
                            Swal.fire({
                                title: 'Error',
                                text: 'An unexpected error occurred. Please try again later.',
                                icon: 'error',
                            });
                        }
                    }
                });
            });
            */
        });

        
});
