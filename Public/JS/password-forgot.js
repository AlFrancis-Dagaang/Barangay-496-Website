

function containsNumber(password) {
    return /\d/.test(password);
}

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
// Function to initialize password strength validation
function initializePasswordValidation() {
    let password = document.getElementById('password');
    let message = document.getElementById('message');

    password.addEventListener('input', () => {
        const passwordValue = password.value;
        const passwordLength = passwordValue.length;

        if (passwordLength > 0) {
            message.style.display = "block";
        } else {
            message.style.display = 'none';
        }

        if (passwordLength < 8) {
            message.innerHTML = 'Password should have at least 8 characters';
            message.style.color = "#cf0000";
            return;
        }

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

        if (errorMessage !== '') {
            message.innerHTML = errorMessage;
            message.style.color = "#cf0000";
        } else {
            message.innerHTML = 'Strong Password';
            message.style.color = "#26d730";
        }
    });
}

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

// Function to initialize password confirmation
function initializePasswordConfirmation() {

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
}

// Function to handle form submission for password reset
function handlePasswordResetSubmission() {
    document.querySelector('.submit-button-reset').addEventListener('click', function(event) {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!password || !confirmPassword) {
            Swal.fire({
                title: "Please fill out all fields",
                icon: "warning",
                text:"New password and confirm password is required",
                showConfirmButton: true, // Display confirm button
                confirmButtonText: 'OK', // Customize confirm button text
                confirmButtonColor: 'rgb(22, 21, 21)',
              });
            return;
        }

        if (password !== confirmPassword) {
            return;
        }

        if (!isPasswordValid(password)) {
            return;
        }

        fetch('/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    document.querySelector('.content').innerHTML = `
                        <div class="success-container">
                            <img src="/images/checked.png" alt="Success" class="image-success">
                            <div class="text-success">
                                <h2>Welcome back <span style="color: rgb(130, 6, 161);">${data.userName}!</span></h2>
                                <p>You have successfully reset your password</p>
                                <button class="go-back-button">Log in</button>
                            </div>
                        </div>
                    `;
                    console.log('Successfully reset password');
                    document.querySelector('.go-back-button').addEventListener('click', function() {
                        // Redirect to homepage when "Sign in" button is clicked
                        window.location.href = '/';
                    });
                });
            } else if (response.status === 400) {
                document.getElementById('password').value = '';
                document.getElementById('confirm-password').value = '';
                return response.json().then(data => {
                    alert(data.error);
                });
            } else {
                console.error('Error:', response.statusText);
                alert('Error resetting password. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Network Error:', error.message);
            alert('Network Error. Please check your internet connection.');
        });
    });
}

// Function to check if the password meets the criteria
function isPasswordValid(password) {
    const passwordLength = password.length;

    if (containsInvalidCharacter(password)) {

        return false;
    }
    
    if (passwordLength < 8) {

        return false;
    }

    if (!containsNumber(password)) {

        return false;
    }

    if (!containsUppercase(password)) {

        return false;
    }
    if (!containsLowercase(password)) {
 
        return false;
    }
    if (!containsSymbol(password)) {

        return false;
    }

    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.querySelector('.form-submit-email');
    const contentWrapper = document.querySelector('.content');
    const verificationHTML = `
        <div class="otp-wrapper">
            <div class="otp verify">
                <h1>Enter OTP</h1>
                <p>A verification code has been sent to your email</p>
                <form action="#" class="verification-form">
                    <div class="input-container">
                        <input type="text" name="otp1" maxlength="1" required>
                        <input type="text" name="otp2" maxlength="1" required>
                        <input type="text" name="otp3" maxlength="1" required>
                        <input type="text" name="otp4" maxlength="1" required>
                        <p id="message-verify" style=" display:flex; align-items: center; margin: 0px 0px 0px 110px;"></p>
                        <button type="submit" class="submit-button2">Verify</button>  
                    </div>
                </form>
            </div>
        </div>
    `;
    const registerHTML = `<div class="reset-wrapper">
        <div class="form-box log-in">
            <h1>Reset Password</h1>
            <form action="#">
                <div class="input-box">
                    <input type="password" name="password"id="password" placeholder="New Password" autocomplete="new-password">
                    <span class="icon eyeButton"><ion-icon name="eye-off-outline" class="icon-eye"></ion-icon></span>
                    <p id="message"></p>
                </div>
                <div class="input-box">
                    <input type="password" id="confirm-password" placeholder="Confirm Password" autocomplete="new-password">
                    <span class="icon eyeButton"><ion-icon name="eye-off-outline" class="icon-eye"></ion-icon></span>
                    <p id="message-confirm"></p>
                </div>
                <button type="submit" class="submit-button-reset">Reset</button>  
            </form>
        </div>
    </div>`;

    emailForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(emailForm);
        const email = formData.get('email');

        if (!email) {
            message = document.getElementById("submit-email");
            message.innerHTML = "<ion-icon name='alert-circle-outline'></ion-icon>Enter your email";
            return;
        }

        const loadingSwal = Swal.fire({
            allowOutsideClick: false, // Prevent closing by clicking outside
            showConfirmButton: false, // Hide the confirm button
            willOpen: () => {
                Swal.showLoading(); // Show the loading spinner
            },
        });

        try {
            const response = await fetch('/send-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                loadingSwal.close();
                contentWrapper.innerHTML = verificationHTML;
            } else {
                console.error('Error sending email for verification');
                document.getElementById('submit-email').innerHTML = "The email is not registered";
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    contentWrapper.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (event.target.classList.contains('verification-form')) {
            const formData = new FormData(event.target);
            let verificationCode = '';

            for (let i = 1; i <= 4; i++) {
                const otpValue = formData.get(`otp${i}`);
                console.log(`otp${i} value:`, otpValue);
                verificationCode += otpValue || '';
            }

            try {
                const response = await fetch('/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ otp: verificationCode })
                });
                if (response.ok) {
                    contentWrapper.innerHTML = registerHTML;
                    initializePasswordValidation();
                    initializePasswordVisibilityToggle();
                    initializePasswordConfirmation();
                    handlePasswordResetSubmission();
                } else {
                    document.getElementById('message-verify').innerHTML = '<ion-icon name="alert-circle-outline"></ion-icon>OTP is incorrect';
                    console.error('Error verifying OTP = '+verificationCode);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
});
