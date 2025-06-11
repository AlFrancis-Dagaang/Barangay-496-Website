
let password = document.getElementById('password');
let message = document.getElementById('message');


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
        message.style.color = "#ff5925";
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
        message.style.color = "#ff5925";
    } else {
        message.innerHTML = 'Strong Password';
        message.style.color = "#26d730";
    }
});

const eyeButton = document.querySelector('.eyeButton');
// Add click event listener to each eye button
eyeButton.addEventListener('click', () => {
    // Toggle password visibility
    if (password.type === 'password') {
        password.type = 'text';
        eyeButton.innerHTML = '<ion-icon name="eye-outline" class="icon-eye"></ion-icon>';
    } else {
        password.type = 'password';
        eyeButton.innerHTML = '<ion-icon name="eye-off-outline" class="icon-eye"></ion-icon>';
    }
});

const confirmPassword = document.getElementById('confirm-password');
const messageConfirm = document.getElementById('message-confirm');

confirmPassword.addEventListener('input', () => {
    if (password.value === confirmPassword.value) {
        messageConfirm.innerHTML = 'Password match';
        messageConfirm.style.color = '#26d730';
    } else {
        messageConfirm.innerHTML = 'Password does not match';
        messageConfirm.style.color = '#ff5925';
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

    if (passwordLength < 8) {
        alert('Password should have at least 8 characters.');
        return false;
    }

    if (!containsNumber(passwordValue)) {
        alert('Password must contain at least one number.');
        return false;
    }

    if (!containsUppercase(passwordValue)) {
        alert('Password must contain at least one uppercase letter.');
        return false;
    }
    if (!containsLowercase(passwordValue)) {
        alert('Password must contain at least one lowercase letter.');
        return false;
    }
    if (!containsSymbol(passwordValue)) {
        alert('Password must contain at least one symbol.');
        return false;
    }

    return true;
}
document.querySelector('.submit-button-reset').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Your validation logic here...
    // Ensure all required fields are filled and passwords match

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if any required field is empty
    if (!password || !confirmPassword) {
        alert('Please fill in all required fields.');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Check if the password is valid (you need to implement this function)
    if (!isPasswordValid(password)) {
        alert('Password is not valid.');
        return;
    }

    // Make a POST request to the server to submit the form data
    fetch('/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password }) // Send password as part of an object
    })
    .then(response => {
        if (response.ok) {
            // Handle success response
            document.querySelector('.content').innerHTML = `
                <div class="success-container">
                    <img src="/images/checked.png" alt="Success" class="image-success">
                    <div class="text-success">
                        <h2>Great !</h2>
                        <p>You successfully reset your password</p>
                        <button class="go-back-button">Sign in</button>
                    </div>
                </div>
            `;
            console.log('Successfully reset password');
        } else if (response.status === 400) {
            // Handle conflict response
            document.getElementById('password').value = '';
            document.getElementById('confirm-password').value = '';
            return response.json().then(data => {
                alert(data.error);
            });
        } else {
            // Handle other error responses
            console.error('Error:', response.statusText);
            alert('Error resetting password. Please try again later.');
        }
    })
    .catch(error => {
        // Handle network errors
        console.error('Network Error:', error.message);
        alert('Network Error. Please check your internet connection.');
    });
});
