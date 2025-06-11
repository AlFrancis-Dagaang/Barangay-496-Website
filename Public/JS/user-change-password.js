document.getElementById('edit-password-link').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior

    Swal.fire({
        html: `
            <div class="password-popup-content">
                <h2>Change Password</h2>
                <div class="reset-wrapper">
                    <p class="requirement-password"><ion-icon name="checkmark-outline"></ion-icon>At least one uppercase letter<br>
                    <ion-icon name="checkmark-outline"></ion-icon>At least one number<br>
                    <ion-icon name="checkmark-outline"></ion-icon>At least one lowercase letter<br>
                    <ion-icon name="checkmark-outline"></ion-icon>At least 8 characters long<br>
                    <ion-icon name="checkmark-outline"></ion-icon>At least one symbol</p>
                    <div class="form-box log-in">
                        <form action="#" id="resetPasswordForm">
                            <div class="input-box">
                                <input type="password" name="password" id="oldPassword" placeholder="Old Password" autocomplete="new-password">
                                <span class="icon eyeButton"><ion-icon name="eye-off-outline" class="icon-eye"></ion-icon></span>
                                <p id="oldPassMessage"></p>
                                <div class="required-message oldMessage"><div><ion-icon name="alert-circle-outline"></ion-icon>Required</div></div>
                            </div>                        
                            <div class="input-box">
                                <input type="password" name="password" id="password" placeholder="New Password" autocomplete="new-password">
                                <span class="icon eyeButton"><ion-icon name="eye-off-outline" class="icon-eye"></ion-icon></span>
                                <p id="message"></p>
                                <div class="required-message newMessage"><div><ion-icon name="alert-circle-outline"></ion-icon>Required</div></div>
                            </div>
                            <div class="input-box">
                                <input type="password" id="confirm-password" placeholder="Confirm Password" autocomplete="new-password">
                                <span class="icon eyeButton"><ion-icon name="eye-off-outline" class="icon-eye"></ion-icon></span>
                                <p id="message-confirm"></p>
                                <div class="required-message"><div><ion-icon name="alert-circle-outline"></ion-icon>Required</div></div>
                            </div>
                            <button type="submit" class="submit-button-reset">Reset</button>  
                        </form>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: false, // Hide pre-made cancel button
        showConfirmButton: false, // Hide pre-made confirm button
        customClass: {
            popup: 'userChangePassword'
            
        },
    });
    initializePasswordValidation();
    initializePasswordVisibilityToggle();
    initializePasswordConfirmation();
    handlePasswordResetSubmission();
        



    function containsNumber(password) {
        return /\d/.test(password);
    }
    
    
    function containsUppercase(password) {
        return /[A-Z]/.test(password);
    }

    function containsSymbol(password) {
        return /[!@#$%^&*(),.?":{}|<>_=]/.test(password);
    }
    
    function containsLowercase(password) {
        return /[a-z]/.test(password);
    }

    function containsInvalidCharacter(password) {
        const invalidCharPattern = /[\\~<\s\t]/; 
        return invalidCharPattern.test(password);
    }

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
                message.style.color = "#cf0000;";
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
                message.style.color = "#cf0000;";
            } else {
                message.innerHTML = 'Strong Password';
                message.style.color = "#26d730";
            }
        });
    }
    
// Function to initialize password visibility toggle
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
            if (password.value === confirmPassword.value && confirmPassword.value!=="") {
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
    
    function handlePasswordResetSubmission() {
        document.querySelector('.submit-button-reset').addEventListener('click', async function(event) {
            event.preventDefault();
    
            const newPassword = document.getElementById('password').value;
            const oldPassword = document.getElementById('oldPassword').value;
            const confirmPassword = document.getElementById('confirm-password').value;
    
            if (!newPassword || !confirmPassword || !oldPassword) {
                const requiredMessages = document.querySelectorAll('.required-message');
                requiredMessages.forEach(message => {
                    message.style.visibility = 'visible';
                    setTimeout(() => {
                        message.style.visibility = 'hidden';
                    }, 1000); // Set visibility to hidden after 1 second
                });
                return;
            }

            if (newPassword !== confirmPassword) {
                console.log("Passwords don't match");
                return;
            }

            if (!isPasswordValid(newPassword)) {
                console.log("password is not valid")
                return;
            }
    
            try {
                // Send data to backend
                const response = await fetch('/new-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newPassword, oldPassword })
                });
    
                // Handle response
                const responseData = await response.json();
                if (response.ok) {
                    // Password updated successfully
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Password change successfully!',
                        showConfirmButton: true, // Display confirm button
                        confirmButtonText: 'OK', // Customize confirm button text
                        confirmButtonColor: 'rgb(22, 21, 21)',
                    });
                } else if (response.status === 401) {
                    // New password same as old password
                    const oldPasswordMessage = document.querySelector('.oldMessage');
                    oldPasswordMessage.innerHTML = 'Old Password is incorrect';
                    oldPasswordMessage.style.visibility = 'visible';
                    setTimeout(() => {
                        oldPasswordMessage.style.visibility = 'hidden';
                    }, 1000); 
                } else if (response.status === 402) {
                    // Account not found
                    const newPasswordMessage = document.querySelector('.newMessage');
                    newPasswordMessage.innerHTML = 'New password must be different from the current password';
                    newPasswordMessage.style.visibility = 'visible';
                    setTimeout(() => {
                        newPasswordMessage.style.visibility = 'hidden';
                    }, 1000); 
                } else {
                    // Other errors
                    console.error('Error:', responseData.error);
                    alert('Error updating password. Please try again later.');
                }
            } catch (error) {
                console.error('Network Error:', error.message);
                alert('Network Error. Please check your internet connection.');
            }
        });
    }
    
    
    // Function to check if the password meets the criteria
    function isPasswordValid(password) {
        const passwordLength = password.length;
        
        if (containsInvalidCharacter(password)) {
            console.log('Password have invalid characters.')
            return false;
        }
        if (passwordLength < 8) {
            console.log('Password should have at least 8 characters.');
            return false;
        }
    
        if (!containsNumber(password)) {
            console.log('Password must contain at least one number.');
            return false;
        }
    
        if (!containsUppercase(password)) {
            console.log('Password must contain at least one uppercase letter.');
            return false;
        }

        if (!containsLowercase(password)) {
            console.log('Password must contain at least one lowercase letter.');
            return false;
        }
        if (!containsSymbol(password)) {
            console.log('Password must contain at least one symbol.');
            return false;
        }
    
        return true;
    }

});


