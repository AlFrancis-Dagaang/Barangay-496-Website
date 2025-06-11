async function checkVerification() {
    try {
        // Make a GET request to your backend route to check verification
        const response = await fetch('/check-verification');
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch verification status');
        }

        // Parse the JSON response
        const data = await response.json();
        
        // Extract the verification status from the response
        const verificationStatus = data.verified;

        console.log('Received verification status:', verificationStatus); // Add this line

        // Return the verification status as a string
        return verificationStatus;
    } catch (error) {
        console.error('Error checking verification:', error);
        return 'error'; // Return 'error' string if an error occurs
    }
}


// Function to handle click on choice
async function handleChoice(choiceId) {
    try {
        const isVerified = await checkVerification();

        if (isVerified==="notVerified") {
            Swal.fire({
                icon: 'error',
                title: 'Your account is not verified!',
                text: 'Please verify your account.',
                html:
                '<button class="custom-verify-button">Verify Your Account</button>',
                showConfirmButton: false,
                focusConfirm: false,
                showCloseButton: true,
                allowOutsideClick: false,
                customClass: {
                    closeButton: 'close-button-swal'
                }
            });
            document.querySelector('.custom-verify-button').addEventListener('click', function() {

                Swal.fire({
                    html:  `
                    <div class="verify-conts">
                        <div class="first-section" style=" border-top: 10px solid black;:">
                            <h2 style="color:black;">Account Verification Form</h2>
                            <p>Verified accounts gain access to advanced features and privileges, further incentivizing users to complete the verification process promptly.
                            Please fill up all the fields accurately to proceed with the registration</p>
                        </div>
                        <div class="second-section">
                            <p id="title" style="color:black;">Full name</p>
                            <div class="full-name">
                                <div class="firstName">
                                    <p>First Name</p>
                                    <div class="input-container inputs">
                                        <input type="text" placeholder="Ex. Juan" style="width: 100%;">
                                    </div>
                                    <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                </div>
                                <div class="middleName">
                                    <p>Middle Name</p>
                                    <div class="input-container inputs">
                                        <input type="text" placeholder="Ex. Protacio" style="width: 100%;">
                                    </div>
                                    <div class="option-message"><ion-icon name="alert-circle-outline"></ion-icon>Optional</div>
                                </div>
                                <div class="lastName">
                                    <p>Last Name</p>
                                    <div class="input-container inputs">
                                        <input type="text" placeholder="Ex. DelaCruz" style="width: 100%;">
                                    </div>
                                    <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                </div>
                            </div>
                        </div>
                        <div class="third-section">
                            <p style="color:black;">Birthdate</p>
                            <div class="input-container inputs">
                                <input type="date">
                            </div>
                            <div class="require-message"><div><ion-icon name="alert-circle-outline"></ion-icon>Required</div></div>
                        </div>
                        <div class="fourth-section">
                            <div class="phone">
                                <label style="color:black; font-size:20px; font-weight:500;">Sex</label>
                                <div class="options" style="margin-top:15px;">
                                    <input type="radio" id="male" name="sex" value="male">
                                    <label for="male">Male</label>                                    
                                    <input type="radio" id="female" name="sex" value="female">
                                    <label for="female">Female</label>
                                </div>
                                <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                            </div>
                            <div class="emails">
                                <p style="color:black;">Email</p>
                                <div class="input-container inputs">
                                    <input type="email" placeholder="Ex. JuanDelaCruz@gmail.com" style="width: 100%;">
                                </div>
                                <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                            </div>
                        </div>
                        <div class="fifth-section">
                            <p class="titleAdress" style="color:black;">Address</p>
                            <div class="house-number street">
                                <div class="houseNumber">
                                    <p>House No./Unit No./Lot/Block/Bldg</p>
                                    <div class="input-container inputs">
                                        <input type="text" placeholder="Ex. 1285" style="width: 100%;">
                                    </div>
                                    <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                </div>
                                <div class="compound">
                                    <p>Compound/Street/Phase/Purok</p>
                                    <div class="input-container inputs">
                                        <input type="text" placeholder="Ex. Crisostomo St. " style="width: 100%;">
                                    </div>
                                    <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                </div>
                            </div>
                            <div class="barangay city">
                                <div class="barangayNumber">
                                    <p>Barangay</p>
                                    <div class="input-container inputs">
                                        <input type="text" placeholder="Ex. Santa Cruz, Brgy.123" style="width: 100%;">
                                    </div>
                                    <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                </div>
                                <div class="yourCity">
                                    <p>City/Municipality</p>
                                    <div class="input-container inputs">
                                        <input type="text" placeholder="Ex. Manila City" style="width: 100%;">
                                    </div>
                                    <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                </div>
                            </div>
                        </div>

                        <div class="sixth-section">
                            <p class="titleAdress" style="color:black;">Upload Image</p>
                            <p  style="font-size:14px;">Upload any supporting image. Any valid Id</p>
                            <img src="/images/card.png" id="card-icon">
                            <div class="file-div">
                                <label for="input-file"><ion-icon style="font-size:25px; color: rgb(0, 119, 255);" name="image-outline"></ion-icon><span>Add image</span></label>
                                <input type="file" accept="image/jpeg, image/png, image/jpg" id="input-file">
                            </div>
                            <div class="require-message" style="visibility:visible;"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                        </div>
                        <div class="submit-section"  style="background-color: transparent;">
                            <button type="submit" class="submit-verify id="submit-to-verify">Submit</button> 
                        </div>
                    </div>`,
                    customClass: {
                        popup: 'verify-swal-container'
                    },
                    showConfirmButton: false
                });

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
            
                // Function to handle middle name input
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

// Function to handle phone input
function handlePhone() {
    const phoneInputs = document.querySelectorAll('.phone input[type="radio"]');
    const phoneMessage = document.querySelector('.phone .require-message');

    phoneInputs.forEach(input => {
        input.addEventListener('click', () => {
            phoneMessage.style.visibility = "hidden";
        });
    });
}

// Function to handle file input
function handleFile() {
    const fileInput = document.getElementById('input-file');
    const fileMessage = document.querySelector('.sixth-section .require-message');

    fileInput.addEventListener('change', () => {
        fileMessage.style.visibility = "hidden";
    });
}

// Call the functions to set up event listeners
handleMiddleName();
handlePhone();
handleFile();


                // add border blue if user is in the section
                const sections = document.querySelectorAll('.verify-conts > div');

                // Add event listeners to inputs in each section
                sections.forEach(section => {
                    const inputs = section.querySelectorAll('input');
                    inputs.forEach(input => {
                        input.addEventListener('focus', () => {
                            // Remove highlighting from all sections
                            sections.forEach(section => {
                                section.classList.remove('highlighted');
                            });

                            // Add highlighting to the current section
                            section.classList.add('highlighted');
                        });
                    });
                });

                

                //change the picture once uploaded
                document.getElementById('input-file').addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    
                    reader.onload = function () {
                        console.log(reader.result);
                        document.getElementById('card-icon').src = reader.result;
                    };
                
                    reader.onerror = function (event) {
                        console.error('Error reading file:', event.target.error);
                    };
                
                    if (file) {
                        reader.readAsDataURL(file);
                    }
                });

                const submitButton = document.querySelector('.submit-verify');

                submitButton.addEventListener('click', function (event) {
                    event.preventDefault();

                    // Get input values
                    const firstName = document.querySelector('.firstName input').value.trim();
                    const middleName = document.querySelector('.middleName input').value.trim();
                    const lastName = document.querySelector('.lastName input').value.trim();
                    const birthdateInput = document.querySelector('.third-section input[type="date"]').value.trim();
                    const sex = document.querySelector('input[name="sex"]:checked');
                    const email = document.querySelector('.emails input[type="email"]').value.trim();
                    const houseNumber = document.querySelector('.houseNumber input').value.trim();
                    const compound = document.querySelector('.compound input').value.trim();
                    const barangay = document.querySelector('.barangayNumber input').value.trim();
                    const city = document.querySelector('.yourCity input').value.trim();
                    const file = document.querySelector('#input-file').files[0];

                    // Validate inputs
                    if (!firstName || !lastName || !birthdateInput || !sex || !email || !houseNumber || !compound || !barangay || !city || !file) {
                        return;
                    }

                    // Construct full name
                    const fullName = `${lastName}, ${firstName} ${middleName}`;

                    const birthdate = new Date(birthdateInput); // Parse input date
                    const formattedBirthdate = `${birthdate.getDate()}/${birthdate.getMonth() + 1}/${birthdate.getFullYear()}`;


                    // Construct address
                    const address = `${houseNumber} ${compound}, ${barangay}, ${city}`;

                    // Log form data to console
                    console.log('Full Name:', fullName);
                    console.log('Birthdate:', formattedBirthdate);
                    console.log('Sex:', sex.value);
                    console.log('Email:', email);
                    console.log('Address:', address);
                    console.log('File:', file ? file.name : ''); // Only log the filename

                    // Prepare form data
                    const dataToSend = {
                        fullName: fullName,
                        birthdate: formattedBirthdate,
                        sex: sex.value,
                        email: email,
                        address: address,
                        fileName: file ? file.name : null // Send file name only
                    };

                    // Send data to backend
                    fetch('/send-verification-form', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataToSend)
                    })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                title: "Success!",
                                icon: 'success',
                                text: 'Your verification form has been successfully submitted',
                                showConfirmButton: true, // Display confirm button
                                confirmButtonText: 'OK', // Customize confirm button text
                                confirmButtonColor: 'rgb(22, 21, 21)',
                            });
                        } else {
                            // Log the response to understand why it's not OK
                            console.log('Server responded with status:', response.status, response.statusText);
                            return response.json().then(data => {
                                throw new Error(data.error || 'An unknown error occurred');
                            });
                        }
                    })
                    .catch(error => {
                        // Handle errors
                        console.log('There was a problem with the fetch operation:', error);
                        alert("Error error error");
                    });
                });
            });

        } else if (isVerified === "pending") {
            Swal.fire({
                icon: 'info',
                title: 'Your account is still under evaluation',
                text: 'Please wait for admin approval.',
                showConfirmButton: false,
                showCloseButton: true
            });
        }else {
            switch (choiceId) {
                case 'request-document':
                    Swal.fire({
                        html: `
                          <div class="container">
                            <h2>Choose Type of Document</h2>
                            <div class="list">
                              <div class="form-element">
                                <input type="checkbox" name="document" value="Barangay Clearance" id="barangay-clearance">
                                <label for="barangay-clearance">
                                  <div class="icon">
                                    <ion-icon name="document-lock-outline"></ion-icon>
                                  </div>
                                  <div class="title">
                                    Barangay Clearance
                                  </div>
                                </label>
                              </div>
                              <div class="form-element">
                                <input type="checkbox" name="document" value="Barangay Indigency" id="barangay-indigency">
                                <label for="barangay-indigency">
                                  <div class="icon">
                                    <ion-icon name="documents-outline"></ion-icon>
                                  </div>
                                  <div class="title">
                                    Barangay Indigency
                                  </div>
                                </label>
                              </div>
                              <div class="form-element">
                                <input type="checkbox" name="document" value="Barangay Certificate" id="barangay-certificate">
                                <label for="barangay-certificate">
                                  <div class="icon">
                                    <ion-icon name="document-text-outline"></ion-icon>
                                  </div>
                                  <div class="title">
                                    Barangay Certificate
                                  </div>
                                </label>
                              </div>
                              <div class="form-element">
                                <input type="checkbox" name="document" value="Business Certificate" id="business-certificate">
                                <label for="business-certificate">
                                  <div class="icon">
                                    <ion-icon name="newspaper-outline"></ion-icon>
                                  </div>
                                  <div class="title">
                                    Business Certificate
                                  </div>
                                </label>
                              </div>
                            </div>
                            <div class="choice-service-message"></div>
                            <button id="nextBtn">Next</button>
                          </div>
                        `,
                        showCloseButton: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'documents-swal-container'
                        }
                    });  

                    
                    // Function to handle checkbox selection
                    function handleCheckboxSelection() {
                        const checkboxes = document.querySelectorAll('.form-element input[type="checkbox"]');
                        checkboxes.forEach(function (checkbox) {
                            checkbox.addEventListener('change', function () {
                                checkboxes.forEach(function (cb) {
                                    if (cb !== checkbox) {
                                        cb.checked = false; // Uncheck other checkboxes
                                    }
                                });
                            });
                        });
                    }

                    // Function to handle "Next" button click
                    function handleNextButtonClick() {
                        const nextBtn = document.getElementById('nextBtn');
                        nextBtn.addEventListener('click', function () {
                            const checkedCheckbox = document.querySelector('.form-element input[type="checkbox"]:checked');
                            if (checkedCheckbox) {
                                const selectedValue = checkedCheckbox.value;
                                        Swal.fire({
                                            html:  `
                                            <div class="BarangayCertificate-conts requestDoc">
                                                <div class="first-section" style=" border-top: 10px solid black;:">
                                                    <h2 style="color:black;"> ${selectedValue} Form</h2>
                                                    <p>Please fill up all the requirement</p>
                                                </div>
                                                <div class="second-section">
                                                    <p id="title" style="color:black;">Full name</p>
                                                    <div class="full-name">
                                                        <div class="firstName">
                                                            <p>First Name</p>
                                                            <div class="input-container inputs">
                                                                <input type="text" placeholder="Ex. Juan" required>
                                                            </div>
                                                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                                        </div>
                                                        <div class="middleName">
                                                            <p>Middle Name</p>
                                                            <div class="input-container inputs">
                                                                <input type="text" placeholder="Ex. Protacio">
                                                            </div>
                                                            <div class="option-message"><ion-icon name="alert-circle-outline"></ion-icon>Optional</div>
                                                        </div>
                                                        <div class="lastName">
                                                            <p>Last Name</p>
                                                            <div class="input-container inputs">
                                                                <input type="text" placeholder="Ex. DelaCruz" required>
                                                            </div>
                                                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="BarangayCertificate-third-section">
                                                    <div class="phoneNumber">
                                                        <label style="color:black;">Phone Number</label>
                                                        <div class="input-container inputs">
                                                        <input type="number" min="11" placeholder="09" required pattern="\d*">
                                                        </div>
                                                        <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                                    </div>
                                                    <div class="BarangayCertificateEmail">
                                                        <label style="color:black;">Email</label>
                                                        <div class="input-container inputs">
                                                            <input type="email" placeholder="Email" required>
                                                        </div>
                                                        <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                                    </div>
                                                    <div class="quantities">
                                                        <p style="color:black;">Quantity</p>
                                                        <div class="input-container inputs">
                                                            <input type="number" placeholder="qty" min="1" required>
                                                        </div>
                                                        <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                                    </div>

                                                </div>
                                                <div class="BarangayCertificate-fourth-section">
                                                    <div class="purpose">
                                                        <label style="color:black;">Purpose</label>
                                                        <div class="message">
                                                        <div class="input-container inputs">
                                                            <select id="Purpose" name="Purpose" required>
                                                                <option value="">Select Purpose</option>
                                                                <option value="Medical Assistance">Medical Assistance</option>
                                                                <option value="Financial Assistance">Financial Assistance</option>
                                                                <option value="Educational Assistance">Educational Assistance</option>
                                                                <option value="Burial Assistance">Burial Assistance</option>
                                                                <option value="Employment Assistance">Employment Assistance</option>
                                                                <option value="General Purpose">General Purpose</option>
                                                            </select>
                                                        </div>
                                                        <div class="require-message" style="visibility:visible;"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                                                    </div>
                                                    </div>
                                                </div>
                                                <div class="submit-section"  style="background-color: transparent;">
                                                    <button type="submit" class="submit-verify">Submit</button> 
                                                </div>
                                            </div>`,
                                            customClass: {
                                                popup: 'BarangayCertificate-swal-container'
                                            },
                                            showConfirmButton: false
                                        });

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
                                            const submitBtn = document.querySelector('.submit-verify');
                                            submitBtn.addEventListener('click', function () {
                                                // Check if all inputs are filled
                                                const emptyInputs = document.querySelectorAll('input[value=""]');
                                                if (emptyInputs.length > 0) {
                                                    alert("Please fill in all fields.");
                                                    return;
                                                }

                                            
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
                                                    return;
                                                }
                                                console.log('Type of Document:', selectedValue);
                                                console.log('Email:', email);
                                                console.log('Name:', name);
                                                console.log('Phone Number:', phoneNumber);
                                                console.log('Quantity:', quantity);
                                                console.log('Purpose:', purpose);

                                                // Prepare data object
                                                const data = {
                                                    selectedValue,
                                                    email,
                                                    information: {
                                                        name,
                                                        number: phoneNumber,
                                                        quantity,
                                                        purpose
                                                    }
                                                };

                                                // Send data to backend (Replace this with your actual backend endpoint)
                                                // Example using fetch API
                                                fetch('/submitServiceData', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(data)
                                                })
                                                .then(response => {
                                                    if (response.ok) {
                                                        Swal.fire({
                                                            icon: 'success',
                                                            title: 'Success!',
                                                            text: 'Your request has been successfully submitted!',
                                                            showConfirmButton: true, // Display confirm button
                                                            confirmButtonText: 'OK', // Customize confirm button text
                                                            confirmButtonColor: 'rgb(22, 21, 21)',
                                                          });
                                                    } else {
                                                        alert("Failed to submit data.");
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error('Error:', error);
                                                    alert("Failed to submit data.");
                                                });
                                            });


                                        
                            } else {
                                message = document.querySelector(".choice-service-message");
                                message.innerHTML = "<ion-icon name='alert-circle-outline'></ion-icon>Please select a document to proceed";
                                message.style.visibility = "visible";
                            }
                        });
                        
                    }

                    // Add event listeners to each checkbox input
                    document.querySelectorAll('.form-element input[type="checkbox"]').forEach(function (checkbox) {
                        checkbox.addEventListener('change', handleCheckboxSelection);
                    });

                    // Call the function for "Next" button click
                    handleNextButtonClick();
  
                    break;
                case 'set-appointment':
                    Swal.fire({
                        html:
                        `
                        <div class="appointment-conts">
                            <div class="title">
                                <h2> Enter Appointment Code </p>
                            </div> 
                            <div class="input-conts">
                                <div class="p-tag">
                                    <p>Please check your email for the appointment code. Enter the code below to proceed in appointment.</p>
                                </div>
                                <div class="code-inputs">
                                    <input type="text"  placeholder="Enter Code">
                                    <ion-icon name="calendar-clear" size="large"></ion-icon>
                                    <div class="warning-div" style="display: none;"><div class="warning"><ion-icon name="alert-circle-outline"></ion-icon><p>Appointment-code cannot find</p></div></div>
                                </div>
                                <div class="input-button">
                                    <button id="submit-appointment-code">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                        `,
                        customClass: {
                            popup: 'appoinment-style-swal', // This will apply your custom class
                        },
                        showConfirmButton: false,
                        allowOutsideClick: true, // Allows clicking outside to close
                        hideClass: {
                            popup: 'my-fade-out', // Custom fade-out animation
                        },
                        didOpen: function() {

                              
                        },
                    });
                    function handleButtonClick() {
                        const inputField = document.querySelector('.code-inputs input'); // The input field for the code
                        const code = inputField.value.trim(); // Get the entered code
                        const warningDiv = document.querySelector('.warning-div'); // The warning div
                      
                        if (!code) {
                          // If the code is empty, show the warning and change the text
                          warningDiv.style.display = 'block';
                          warningDiv.querySelector('p').textContent = 'Enter appointment code';
                          return; // Exit early if the code is empty
                        }
                      
                        fetch('/validate-appointment-code', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ appointmentCode: code }), // Send the code to the backend
                        })
                          .then((response) => {
                            if (response.ok) {
                              return response.json();
                            } else {
                              throw response; // Throw the response to handle errors
                            }
                          })
                          .then((data) => {
                            if (data.status === 'code-valid') {
                                const appointment = data.matchingAppointment; // Extract the appointment data
                                const matchingRequest = data.matchingRequest; // Extract the matching request data

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
                                                <hr>
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
                                            <div>
                                                <button id="set-appointment-now">
                                                    Set Appointment
                                                </button>
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
                                            document.getElementById("set-appointment-now").addEventListener("click", ()=>{
                                                Swal.fire({
                                                    html:
                                                    `
                                                    <div class="setdate-conts">
                                                        <div class="set-date-heading">Set a date</div>
                                                        <div class="set-date-info"><p><ion-icon name="information-circle-outline"></ion-icon>To set your Booking appointment, click on the desired date of your appointment.<br><br><ion-icon name="information-circle-outline"></ion-icon>
                                                        Click “Complete Appointment” to get confirmation details of your appointment, which will also be sent to the email you provided.</p></div>
                                                        <div class="date-input"><input type="date"><div>
                                                        <div class="warning-div" style="display: none;"><div class="warning"><ion-icon name="alert-circle-outline"></ion-icon><p>Set a date before proceed</p></div></div>
                                                        <button id="set-date-button">Complete Appointment</div>
                                                    </div>
                                                    `,
                                                    customClass: {
                                                        popup: 'set-appoinment-now-swal', // This will apply your custom class
                                                    },
                                                    showConfirmButton: false,
                                                    allowOutsideClick: true, // Allows clicking outside to close
                                                    hideClass: {
                                                        popup: 'my-fade-out', // Custom fade-out animation
                                                    },
                                                    didOpen: function() {
                                                        document.getElementById("set-date-button").addEventListener("click", () => {
                                                            const dateInput = document.querySelector('.date-input input'); // The input field for the date
                                                            const selectedDate = dateInput.value; // Get the entered date
                                                            const warningDiv = document.querySelector('.warning-div'); // The warning div
                                                            
                                                            if (!selectedDate) { // Check if date input is empty
                                                              // Show the warning and update its text
                                                              warningDiv.style.display = 'block';
                                                              warningDiv.querySelector('p').textContent = 'Set a date before proceeding';
                                                              return; // Exit early if no date is selected
                                                            }

                                                            const selectedDateObj = new Date(selectedDate);
                                                            const today = new Date();
                                                            today.setHours(0, 0, 0, 0); // Set the time to the start of the day for comparison
                                                        
                                                            // Check if the selected date is in the past
                                                            if (selectedDateObj < today) {
                                                                // Show the warning and update its text
                                                                warningDiv.style.display = 'block';
                                                                warningDiv.querySelector('p').textContent = 'The date is invalid';
                                                                return; // Exit early if the date is in the past
                                                            }




                                                            
                                                            // Assuming you have the appointment code (from context, session, or previous data)
                                                            const appointmentCode = appointment.appointmentCode; // Replace with the actual code

                                                            const loadingSwal = Swal.fire({
                                                                allowOutsideClick: false, // Prevent closing by clicking outside
                                                                showConfirmButton: false, // Hide the confirm button
                                                                willOpen: () => {
                                                                    Swal.showLoading(); // Show the loading spinner
                                                                },
                                                            });
                                                            
                                                            fetch('/set-appointment-date', { // Your backend endpoint for setting the appointment date
                                                              method: 'POST',
                                                              headers: {
                                                                'Content-Type': 'application/json',
                                                              },
                                                              body: JSON.stringify({ appointmentCode, selectedDate }), // Send the appointment code and selected date
                                                            })
                                                            .then(response => {
                                                              if (response.ok) {
                                                                loadingSwal.close();
                                                                Swal.fire({
                                                                  title: 'Appointment Set!',
                                                                  text: 'Your appointment date has been successfully set.',
                                                                  icon: 'success',
                                                                  showConfirmButton: true, // Display confirm button
                                                                  confirmButtonText: 'OK', // Customize confirm button text
                                                                  confirmButtonColor: 'rgb(22, 21, 21)',
                                                                });
                                                              } else {
                                                                throw new Error('Failed to set the appointment date'); // Handle any error response
                                                              }
                                                            })
                                                            .catch((error) => {
                                                              console.error('Error setting appointment date:', error);
                                                              Swal.fire({
                                                                title: 'Error',
                                                                text: 'An error occurred while setting the appointment date.',
                                                                icon: 'error',
                                                              });
                                                            });
                                                        });//end for event lisnter
                                                                                                                
                                                    },
                                                });// end for swal fire


                                            }); // end for add event listener
                                        }
                                    });

                                } else if(appointment.appointmentType ==="Complaint"){
                                    
                                }

                            } else if (data.status === 'code-not-found') {
                              warningDiv.style.display = 'block';
                              warningDiv.querySelector('p').textContent = 'Appointment-code is invalid';
                            } else if (data.status === 'code-in-use') {
                              warningDiv.style.display = 'block';
                              warningDiv.querySelector('p').textContent = 'The appointment code is already  used.';
                            }
                          })
                          .catch((response) => {
                            if (response.status === 404) {
                              warningDiv.style.display = 'block';
                              warningDiv.querySelector('p').textContent = 'Appointment-code is invalid';
                            } else if (response.status === 400) {
                              warningDiv.style.display = 'block';
                              warningDiv.querySelector('p').textContent = 'The appointment code is already  used';
                            }else if (response.status === 403) {
                                warningDiv.style.display = 'block';
                                warningDiv.querySelector('p').textContent = 'Appointment code cannot be used anymore';
                            } else {
                              console.error('Error sending appointment code:', response);
                              Swal.fire({
                                title: 'Error',
                                text: 'An unexpected error occurred.',
                                icon: 'error',
                              });
                            }
                          });
                      }
                      
                      document.getElementById("submit-appointment-code").addEventListener("click", handleButtonClick); // Attach the event handler
                                        
                   
                    
                    break;
                case 'write-complaint':
                    Swal.fire({
                        html:
                        `
                        <div class="main-conts">
                            <div class="complaint-form-title">
                                <h2>Write Complaint</h2>
                            </div>
                            <div class="form-description">
                                User Complaint Form
                            </div>
                            <div class="form-content">
                                <div class="cmplt-each-cnts">
                                    <div id="frst-name">
                                        <p>First Name:</p>
                                        <div class="inputs"><input type="text" placeholder="First Name"></div>
                                        <div  class="cmplt-message"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >
                                    </div>
                                    <div id="lst-name">
                                        <p>Last Name:</p>
                                        <div class="inputs"><input type="text" placeholder="Last Name"></div>
                                        <div class="cmplt-message"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >
                                    </div>
                                </div>
                                <div class="cmplt-each-cnts">
                                    <div id="cmpltEmail">
                                        <p>Email:</p>
                                        <div class="inputs"><input type="text" placeholder="Email"></div>
                                        <div class="cmplt-message"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >
                                    </div>
                                </div>
                                <div class="cmplt-each-cnts">
                                    <div id="cmpltEmail">
                                        <p>Phone number:</p>
                                        <div class="inputs"><input type="number" min="11" placeholder="Phone Number" required pattern="\d*"></div>
                                        <div class="cmplt-message"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >
                                    </div>
                                </div>
                                <div class="cmplt-each-cnts">
                                    <div id="cmpltCategory">
                                        <p>Reason for Complaint:</p>
                                        <div class="inputs">
                                            <select>
                                                <option value="" style="color: #868686">Select a category</option> <!-- Default option -->
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
                                                <option value="Animal Control">Others</option>
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
                                            <textarea rows="4" placeholder="Describe your complaint..."></textarea>
                                        </div>
                                        <div class="cmplt-message">
                                            <ion-icon name="alert-circle-outline"></ion-icon><p>Required</p>
                                        </div>
                                    </div>
                                </div>
        
                                <button id="submit-cmplt">Submit</button> 
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
                                };
        
                                console.log(data);
        
                                // Send data to backend
                                fetch("/submit-complaint", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                                })
                                .then((response) => {
                                    if (response.ok) {
                                    Swal.fire({
                                        title: "Complaint Submitted!",
                                        text: "Your complaint has been submitted successfully.",
                                        icon: "success",
                                        showConfirmButton: true, // Display confirm button
                                        confirmButtonText: 'OK', // Customize confirm button text
                                        confirmButtonColor: 'rgb(22, 21, 21)',
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
                    break;
                default:
                    break;
            }
        }
    } catch (error) {
        console.error('Error handling choice:', error);
    }
}

// Add event listeners to each choice
document.querySelectorAll('.choice').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        handleChoice(event.currentTarget.id);
    });

});


document.getElementById('sample-backend').addEventListener('click', async () => {
    const status = await checkVerification();
    if (status === 'notVerified') {
        Swal.fire({
            html:  `
            <div class="verify-conts">
                <div class="first-section" style=" border-top: 10px solid black;:">
                    <h2 style="color:black;">Account Verification Form</h2>
                    <p>Verified accounts gain access to advanced features and privileges, further incentivizing users to complete the verification process promptly.
                    Please fill up all the fields accurately to proceed with the registration</p>
                </div>
                <div class="second-section">
                    <p id="title" style="color:black;">Full name</p>
                    <div class="full-name">
                        <div class="firstName">
                            <p>First Name</p>
                            <div class="input-container inputs">
                                <input type="text" placeholder="Ex. Juan" style="width: 100%;">
                            </div>
                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                        </div>
                        <div class="middleName">
                            <p>Middle Name</p>
                            <div class="input-container inputs">
                                <input type="text" placeholder="Ex. Protacio" style="width: 100%;">
                            </div>
                            <div class="option-message"><ion-icon name="alert-circle-outline"></ion-icon>Optional</div>
                        </div>
                        <div class="lastName">
                            <p>Last Name</p>
                            <div class="input-container inputs">
                                <input type="text" placeholder="Ex. DelaCruz" style="width: 100%;">
                            </div>
                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                        </div>
                    </div>
                </div>
                <div class="third-section">
                    <p style="color:black;">Birthdate</p>
                    <div class="input-container inputs">
                        <input type="date">
                    </div>
                    <div class="require-message"><div><ion-icon name="alert-circle-outline"></ion-icon>Required</div></div>
                </div>
                <div class="fourth-section">
                    <div class="phone">
                        <label style="color:black; font-size:20px; font-weight:500;">Sex</label>
                        <div class="options" style="margin-top:15px;">
                            <input type="radio" id="male" name="sex" value="male">
                            <label for="male">Male</label>                                    
                            <input type="radio" id="female" name="sex" value="female">
                            <label for="female">Female</label>
                        </div>
                        <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                    </div>
                    <div class="emails">
                        <p style="color:black;">Email</p>
                        <div class="input-container inputs">
                            <input type="email" placeholder="Ex. JuanDelaCruz@gmail.com" style="width: 100%;">
                        </div>
                        <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                    </div>
                </div>
                <div class="fifth-section">
                    <p class="titleAdress" style="color:black;">Address</p>
                    <div class="house-number street">
                        <div class="houseNumber">
                            <p>House No./Unit No./Lot/Block/Bldg</p>
                            <div class="input-container inputs">
                                <input type="text" placeholder="Ex. 1285" style="width: 100%;">
                            </div>
                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                        </div>
                        <div class="compound">
                            <p>Compound/Street/Phase/Purok</p>
                            <div class="input-container inputs">
                                <input type="text" placeholder="Ex. Crisostomo St. " style="width: 100%;">
                            </div>
                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                        </div>
                    </div>
                    <div class="barangay city">
                        <div class="barangayNumber">
                            <p>Barangay</p>
                            <div class="input-container inputs">
                                <input type="text" placeholder="Ex. Santa Cruz, Brgy.123" style="width: 100%;">
                            </div>
                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                        </div>
                        <div class="yourCity">
                            <p>City/Municipality</p>
                            <div class="input-container inputs">
                                <input type="text" placeholder="Ex. Manila City" style="width: 100%;">
                            </div>
                            <div class="require-message"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                        </div>
                    </div>
                </div>

                <div class="sixth-section">
                    <p class="titleAdress" style="color:black;">Upload Image</p>
                    <p  style="font-size:14px;">Upload any supporting image. Any valid Id</p>
                    <img src="/images/card.png" id="card-icon">
                    <div class="file-div">
                        <label for="input-file"><ion-icon style="font-size:25px; color: rgb(0, 119, 255);" name="image-outline"></ion-icon><span>Add image</span></label>
                        <input type="file" accept="image/jpeg, image/png, image/jpg" id="input-file">
                    </div>
                    <div class="require-message" style="visibility:visible;"><ion-icon name="alert-circle-outline"></ion-icon>Required</div>
                </div>
                <div class="submit-section"  style="background-color: transparent;">
                    <button type="submit" class="submit-verify">Submit</button> 
                </div>
            </div>`,
            customClass: {
                popup: 'verify-swal-container'
            },
            showConfirmButton: false
        });

        
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
        // Function to handle middle name input
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

// Function to handle phone input
function handlePhone() {
const phoneInputs = document.querySelectorAll('.phone input[type="radio"]');
const phoneMessage = document.querySelector('.phone .require-message');

phoneInputs.forEach(input => {
input.addEventListener('click', () => {
    phoneMessage.style.visibility = "visible";
});
});
}

// Function to handle file input
function handleFile() {
const fileInput = document.getElementById('input-file');
const fileMessage = document.querySelector('.sixth-section .require-message');

fileInput.addEventListener('change', () => {
fileMessage.style.visibility = "hidden";
});
}

// Call the functions to set up event listeners
handleMiddleName();
handlePhone();
handleFile();


        // add border blue if user is in the section
        const sections = document.querySelectorAll('.verify-conts > div');

        // Add event listeners to inputs in each section
        sections.forEach(section => {
            const inputs = section.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    // Remove highlighting from all sections
                    sections.forEach(section => {
                        section.classList.remove('highlighted');
                    });

                    // Add highlighting to the current section
                    section.classList.add('highlighted');
                });
            });
        });

        

        //change the picture once uploaded
        document.getElementById('input-file').addEventListener('change', (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function () {
                console.log(reader.result);
                document.getElementById('card-icon').src = reader.result;
            };
        
            reader.onerror = function (event) {
                console.error('Error reading file:', event.target.error);
            };
        
            if (file) {
                reader.readAsDataURL(file);
            }
        });

        const submitButton = document.querySelector('.submit-verify');

        submitButton.addEventListener('click', function (event) {
            event.preventDefault();

            // Get input values
            const firstName = document.querySelector('.firstName input').value.trim();
            const middleName = document.querySelector('.middleName input').value.trim();
            const lastName = document.querySelector('.lastName input').value.trim();
            const birthdateInput = document.querySelector('.third-section input[type="date"]').value.trim();
            const sex = document.querySelector('input[name="sex"]:checked');
            const email = document.querySelector('.emails input[type="email"]').value.trim();
            const houseNumber = document.querySelector('.houseNumber input').value.trim();
            const compound = document.querySelector('.compound input').value.trim();
            const barangay = document.querySelector('.barangayNumber input').value.trim();
            const city = document.querySelector('.yourCity input').value.trim();
            const file = document.querySelector('#input-file').files[0];

            // Validate inputs
            if (!firstName || !lastName || !birthdateInput || !sex || !email || !houseNumber || !compound || !barangay || !city || !file) {
                return;
            }

            // Construct full name
            const fullName = `${lastName}, ${firstName} ${middleName}`;

            const birthdate = new Date(birthdateInput); // Parse input date
            const formattedBirthdate = `${birthdate.getDate()}/${birthdate.getMonth() + 1}/${birthdate.getFullYear()}`;


            // Construct address
            const address = `${houseNumber} ${compound}, ${barangay}, ${city}`;

            // Log form data to console
            console.log('Full Name:', fullName);
            console.log('Birthdate:', formattedBirthdate);
            console.log('Sex:', sex.value);
            console.log('Email:', email);
            console.log('Address:', address);
            console.log('File:', file ? file.name : ''); // Only log the filename

            // Prepare form data
            const dataToSend = {
                fullName: fullName,
                birthdate: formattedBirthdate,
                sex: sex.value,
                email: email,
                address: address,
                fileName: file ? file.name : null // Send file name only
            };

            // Send data to backend
            fetch('/send-verification-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: "Success!",
                        icon: 'success',
                        text: 'Your verification form has been successfully submitted',
                        showConfirmButton: true, // Display confirm button
                        confirmButtonText: 'OK', // Customize confirm button text
                        confirmButtonColor: 'rgb(22, 21, 21)',
                    });
                } else {
                    // Log the response to understand why it's not OK
                    console.log('Server responded with status:', response.status, response.statusText);
                    return response.json().then(data => {
                        throw new Error(data.error || 'An unknown error occurred');
                    });
                }
            })
            .catch(error => {
                // Handle errors
                console.log('There was a problem with the fetch operation:', error);
                alert('An error occurred while submitting the form.');
            });
            
        });

        
        
    
    } else if (status === 'pending') {
        Swal.fire({
            icon: 'info',
            title: 'Your account is still under evaluation',
            text: 'Please wait for admin approval.',
            showConfirmButton: false,
            showCloseButton: true
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error checking your verification status. Please try again later.',
            showConfirmButton: true
        });
    }
});

