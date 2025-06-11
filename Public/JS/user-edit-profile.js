document.getElementById('edit-profile-link').addEventListener('click', () => {
    event.preventDefault(); // Prevent the default link behavior
    // Make a GET request to fetch user profile data
    fetch('/fetch-profile-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user profile data');
            }
            return response.json();
        })
        .then(userData => {
            // Handle the fetched user profile data
            Swal.fire({
                html: `
                    <div class="edit-profile-wrapper">
                        <div class="background"></div>
                        <div class="h3"><h3>Profile</h3></div>
                        <div class="update-picture">
                            <img src="${userData.profileImage}" alt="Profile Picture" id="profile-icon">
                            <label for="input-file">Change Picture</label>
                            <input type="file" accept="image/jpeg, image/png, image/jpg" id="input-file">
                        </div>
                        <div class="form">
                            <form>
                                <div class="input-box">
                                    <label for="user-name">User Name</label>
                                    <input type="text" placeholder="${userData.userName}" id="user-name">
                                    <span class=""><ion-icon name="pencil-outline"></ion-icon></span>
                                </div>
                                <div class="input-box">
                                    <label for="email">Email</label>
                                    <input type="email"  placeholder="${userData.email}" id="email">
                                    <span class=""><ion-icon name="pencil-outline"></ion-icon></span>
                                    <p id="message-email" style="display: flex; visibility: hidden; align-items: center; margin-top: 8px; color: #cf0000; font-size: 14px;"><ion-icon name="alert-circle-outline"></ion-icon>This email address is already taken.</p>
                                </div>
                                <button type="submit" class="submit-button">Update Profile</button>  
                            </form>
                        </div>
                    </div>
                `,
                showCancelButton: false, // Hide pre-made cancel button
                showConfirmButton: false, // Hide pre-made confirm button
                showCloseButton: true,
                customClass: {
                    popup: 'custom-swal-container'
                },
            });

            // Event listener for the button
            document.getElementById('input-file').addEventListener('change', (event) => {
                const file = event.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function () {
                    console.log(reader.result);
                    document.getElementById('profile-icon').src = reader.result;
                };
            
                reader.onerror = function (event) {
                    console.error('Error reading file:', event.target.error);
                };
            
                if (file) {
                    reader.readAsDataURL(file);
                }
            });

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

            document.querySelector('.submit-button').addEventListener('click', async (event) => {
                event.preventDefault(); // Prevent form submission
            
                const emailInput = document.getElementById('email').value;
                const username = document.getElementById('user-name').value;
                const profileImageInput = document.getElementById('input-file').files[0]; // Get selected profile image file

                if (emailInput) {
                    // Check if email exists
                    if (await checkEmailAndShowMessage(emailInput)) {
                        const messageEmail = document.getElementById('message-email');
                        messageEmail.style.visibility = 'visible';
            
                        setTimeout(() => {
                            messageEmail.style.visibility = 'hidden';
                        }, 3000);
            
                        return;
                    }
                }

                
                  const loadingSwal = Swal.fire({
                        allowOutsideClick: false, // Prevent closing by clicking outside
                        showConfirmButton: false, // Hide the confirm button
                        willOpen: () => {
                            Swal.showLoading(); // Show the loading spinner
                        },
                    });
                
            
                try {

                    // Prepare data object
                    const dataToSend = {
                        username: username,
                        email: emailInput,
                        profileImage: profileImageInput ? profileImageInput.name : null // Send file name only
                    };
            
                    // Send the data object to the backend
                    const updateResponse = await fetch('/update-profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dataToSend)
                    });
            
                    if (updateResponse.ok) {
                        loadingSwal.close();
                        updateProfileHeader(username, profileImageInput);
                        const responseData = await updateResponse.json(); // Parse response JSON
                        console.log(responseData.message);
                        if(responseData.message==="usernameOrProfile"){
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Profile updated successfully!',
                                confirmButtonText: 'OK',
                                confirmButtonColor: 'rgb(22, 21, 21)',
                            });
                        }else{
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Profile updated successfully!',
                                confirmButtonText: 'OK',
                                confirmButtonColor: 'rgb(22, 21, 21)',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // Display another SweetAlert after the user clicks the confirm button
                                    Swal.fire({
                                        icon: 'info',
                                        title: 'Verification Email Sent',
                                        text: 'A verification email has been sent to your email address.',
                                        confirmButtonText: 'OK'
                                    });
                                }
                            });
                        }
                    } else {
                        throw new Error('Failed to update profile');
                    }
                } catch (error) {
                    console.error('Error updating profile:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to update profile. Please try again later.'
                    });
                }
            });



            function updateProfileHeader(username, profileImage) {
                const profileNameElement = document.querySelector('.profile-name .user-userName');
                const profileImageElement = document.querySelector('.user-logo');
                const profileImageElementDropDown = document.querySelector('.user-drop-logo');
                
                // Update profile name if it's not null
                if (username !== null && username!== "") {
                    console.log("i change the username in browser, "+username);
                    profileNameElement.innerHTML= username;
                }
            
                if (profileImage instanceof File && profileImage.name !== "") {
                    // Extract file name from profileImage
                    const fileName = profileImage.name;
                    // Set profile image source with the file name
                    profileImageElement.src = "/images/" + fileName;
                    profileImageElementDropDown.src = "/images/" + fileName;
                }
            }            
        })
        .catch(error => {
            console.error('Error fetching user profile data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch user profile data. Please try again later.'
            });
        });
});

