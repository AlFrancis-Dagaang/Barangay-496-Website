
let password = document.getElementById('password');
let message = document.getElementById('message');
let strength = document.getElementById('strength');

// Function to check if the password contains at least one number
function containsNumber(password) {
    return /\d/.test(password);
}

// Function to check if the password contains at least one uppercase letter
function containsUppercase(password) {
    return /[A-Z]/.test(password);
}

function containsSymbol(password) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function containsLowercase(password) {
    return /[a-z]/.test(password);
}

function containsInvalidCharacter(password) {
    const invalidCharPattern = /[\\~<\s\t]/; // Regex to detect invalid characters
    return invalidCharPattern.test(password);
}


// Event listener for password input
password.addEventListener('input', () => {
    const passwordValue = password.value;
    const passwordLength = passwordValue.length;

    if (passwordLength > 0) {
        message.style.display = "block";
    } else {
        message.style.display = 'none';
    }

    // Check if password length is less than 8 characters
    if (passwordLength < 8) {
        message.innerHTML = 'Password should have at least 8 characters';
        message.style.color = "#cf0000";
        return; // Exit the function early if the length condition is not met
    }

    // Check if the password contains numbers and/or an uppercase letter
    let errorMessage = '';
    if (!containsNumber(passwordValue)) {
        errorMessage += 'Must contain at least one number. ';
    }
    if (!containsUppercase(passwordValue)) {
        errorMessage += 'Must contain at least one uppercase letter. ';
    }
    if (!containsLowercase(passwordValue)) {
        errorMessage += 'Must contain at least one lowercase letter. ';
    }
    if (!containsSymbol(passwordValue)) {
        errorMessage += 'Must contain at least one symbol. ';
    }

    // Update message based on errors or strong password
    if (errorMessage !== '') {
        message.innerHTML = errorMessage;
        message.style.color = "#cf0000";
    } else {
        message.innerHTML = 'Strong Password';
        message.style.color = "#26d730";
    }
});

initializePasswordVisibilityToggle();

function initializePasswordVisibilityToggle() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const eyeButtons = document.querySelectorAll('.eyeButton');

    eyeButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const passwordInput = passwordInputs[index];
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
            button.innerHTML = passwordInput.type === 'password' ? '<ion-icon name="eye-off-outline" class="icon-eye"></ion-icon>' : '<ion-icon name="eye-outline" class="icon-eye"></ion-icon>';
        });
    });
}


const confirmPassword = document.getElementById('confirm-password');
const messageConfirm = document.getElementById('message-confirm');

confirmPassword.addEventListener('input', () => {
    if (password.value === confirmPassword.value) {
        if(confirmPassword.value!=="" && password.value!==""){
            messageConfirm.innerHTML = 'Password match';
            messageConfirm.style.color = '#26d730';
        }else{
            messageConfirm.innerHTML = '';
        }
    } else {
        if(confirmPassword.value!=="" && password.value!==""){
            messageConfirm.innerHTML = 'Password does not match';
            messageConfirm.style.color = '#cf0000';
        }else{
            messageConfirm.innerHTML = '';
        }

    }
});

// Function to check if passwords match
function checkPasswordMatch() {
    return password.value === confirmPassword.value;
}

// Function to check if the password meets the criteria
function isPasswordValid() {
    const passwordValue = password.value;
    const passwordLength = passwordValue.length;

    if (containsInvalidCharacter(passwordValue)) {
        return false;
    }

    if (passwordLength < 8) {
        return false;
    }

    if (!containsNumber(passwordValue)) {
        return false;
    }

    if (!containsUppercase(passwordValue)) {
        return false;
    }
    if (!containsLowercase(passwordValue)) {
        return false;
    }
    if (!containsSymbol(passwordValue)) {
        return false;
    }

    return true;
}


async function checkEmailAndShowMessage(email) {
    try {
        const response = await fetch('/check-existingEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        console.log(data.exists+" space between");
        
        if (data.exists) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}


// Event listener for form submission
document.querySelector('.submit-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Your validation logic here...
    // Ensure all required fields are filled and passwords match

    const userName = document.querySelector('.userName').value;
    const email = document.querySelector('.email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    let errorDuplicate = document.getElementById('message-error');

    // Check if any required field is empty
    if (!userName || !email || !password || !confirmPassword) {
        Swal.fire({
            title: "Please fill out all fields",
            icon: "warning",
            confirmButtonText: 'Ok',
            customClass: {
                popup: 'custom-popup',
                icon:'custom-icon',
                title: 'custom-sweetalert',
                confirmButton: 'custom-sweetalert-button'
            },
            buttonsStyling: false
        });
          
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return;
    }

    // Check if the password is valid (you need to implement this function)
    if (!isPasswordValid(password)) {
        return;
    }

    // Proceed with form submission
    const formData = {
        userName,
        email,
        password,
    };

    // Call the asynchronous function and handle its result
    checkEmailAndShowMessage(email).then(emailExists => {
        if (emailExists) {
            const messageEmail = document.getElementById('message-email');
            messageEmail.style.visibility = 'visible';

            setTimeout(() => {
                messageEmail.style.visibility = 'hidden';
            }, 3000);
        } else {
            const loadingSwal = Swal.fire({
                title: 'Verify your email',
                text: 'We send a verification to your email ',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                },
            });

            // Make a POST request to the server to submit the form data
            fetch('/signup-waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    loadingSwal.close();
                    Swal.fire({
                        title: "Good job!",
                        text: "You successfully signed up ",
                        icon: "success",
                        confirmButtonColor: 'rgb(22, 21, 21)',
                        confirmButtonText: 'Log in',
                        customClass: {
                            confirmButton: 'custom-button-class'
                        },
                        didClose: () => {
                            // Reset form fields and messages
                            document.querySelector('.userName').value = '';
                            document.querySelector('.email').value = '';
                            document.getElementById('password').value = '';
                            document.getElementById('confirm-password').value = '';
                            document.getElementById('message').innerHTML = '';
                            document.getElementById('message-confirm').innerHTML = '';
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Redirect to another page
                            window.location.href = "/";
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error submitting form data:', error.message);
            });
        }
    });
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('go-back-button')) {
        location.href = '/'; // Redirect to the "/" URL
    }
});