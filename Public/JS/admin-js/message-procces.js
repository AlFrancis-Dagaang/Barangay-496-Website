document.addEventListener('DOMContentLoaded', () => {
    // Select all elements with the specified data-icon
    const viewMessages = document.querySelectorAll('.message-section .actions div[data-icon="view-user-messages"]');
    const deleteIcons = document.querySelectorAll('ion-icon[data-icon="delete-user-messages"]');


  
    // Loop through each selected element to add click event listeners
    viewMessages.forEach((icon) => {
      icon.addEventListener('click', async () => {
        // Get the parent element with data-email and data-id attributes
        const parentElement = icon.closest('.each-user-conts');
        const email = parentElement.getAttribute('data-email');
        const id = parentElement.getAttribute('data-id');
  
        try {
          // Send a GET request to the backend with email and id as query parameters
          const response = await fetch(`/get-message-details?email=${email}&id=${id}`, {
            method: 'GET',
          });
  
          if (response.ok) {
            // Parse the JSON response
            const messageData = await response.json();
  
            Swal.fire({
                html:`
    
                <div class="messge-cnts">
                    <div class="mssge-title">Messages</div>
                    <div class="mssge-from">From: <span>${messageData.name}</span></div>
                    <div class="mssge-email">Email: <span>${messageData.email}</span></div>
                    <div class="mssge-inbox">
                            Message: 
                            <br>
                            <br>
                        <div class="mssge-sec">
                            <p>${messageData.message}</p>
                        </div>
                    </div>
                    <div class="mssg-reply">
                        <p>Reply:</p>
                        <div class="txtarea">
                            <!-- Replace the single-line input with a multi-line textarea -->
                            <textarea rows="4" placeholder="Write your reply"></textarea>
                        </div>
                    </div>
                    <div class="mssge-reqs"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >

                    <button id="replyBttn">Reply</button>
                </div>
    
    
                `,
                customClass: {
                        popup: 'user-message-swal', // This will apply your custom class
                },
                showConfirmButton: false,
                allowOutsideClick: true, // Optional, allow closing the popup by clicking outside
                didOpen: (popup) => {
                    const replyButton = popup.querySelector('#replyBttn');
                    const textarea = popup.querySelector('textarea');
                    const requiredMessage = popup.querySelector('.mssge-reqs');
        
                    // Add click event listener to the "Reply" button
                    replyButton.addEventListener('click', async () => {
                        const replyText = textarea.value.trim(); // Get the textarea content
        
                        if (replyText === '') { // Check if it's empty
                            requiredMessage.style.visibility = 'visible'; // Show the "Required" message
                        } else {
                            requiredMessage.style.visibility = 'hidden'; // Hide the "Required" message
        
                            try {

                                const loadingSwal = Swal.fire({
                                    allowOutsideClick: false, // Prevent closing by clicking outside
                                    showConfirmButton: false, // Hide the confirm button
                                    willOpen: () => {
                                        Swal.showLoading(); // Show the loading spinner
                                    },
                                });
                                // Send the reply to the backend
                                const response = await fetch('/reply-to-message', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        email,
                                        id,
                                        reply: replyText,
                                    }),
                                });
        
                                if (response.ok) {
                                    loadingSwal.close();
                                    Swal.fire({
                                        title: 'Reply Sent!',
                                        text: 'Your reply has been sent successfully.',
                                        icon: 'success',
                                        showConfirmButton: true, // Display confirm button
                                        confirmButtonText: 'OK', // Customize confirm button text
                                        confirmButtonColor: 'rgb(22, 21, 21)',
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                          location.reload(); // Refresh the page when confirmed
                                        }
                                      });
                                } else {
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'Failed to send your reply. Please try again.',
                                        icon: 'error',
                                    });
                                }
                            } catch (error) {
                                Swal.fire({
                                    title: 'Error',
                                    text: 'An unexpected error occurred.',
                                    icon: 'error',
                                });
                            }
                        }
                    });
                },
                });






          } else {
            Swal.fire({
              title: 'Error',
              text: 'Unable to retrieve message details.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'An unexpected error occurred.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
    });

    deleteIcons.forEach((icon) => {
        icon.addEventListener('click', async () => {
          // Get the parent element with data-email and data-id attributes
          const parentElement = icon.closest('.each-user-conts');
          const email = parentElement.getAttribute('data-email');
          const id = parentElement.getAttribute('data-id');
    
          // Show confirmation pop-up
          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this message?',
            icon: 'warning',
            showCancelButton: true, // Show cancel button
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
          }).then(async (result) => {
            if (result.isConfirmed) {
              // If the user confirms, send a DELETE request to the backend
              try {
                const response = await fetch('/delete-user-message', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, id }), // Send email and id
                });
    
                if (response.ok) {
                  Swal.fire({
                    title: 'Deleted!',
                    text: 'The message has been deleted.',
                    icon: 'success',
                    showConfirmButton: true, // Display confirm button
                    confirmButtonText: 'OK', // Customize confirm button text
                    confirmButtonColor: 'rgb(22, 21, 21)',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      location.reload(); // Refresh the page when confirmed
                    }
                  });
                } else {
                  Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while deleting the message.',
                    icon: 'error',
                  });
                }
              } catch (error) {
                Swal.fire({
                  title: 'Error',
                  text: 'An unexpected error occurred.',
                  icon: 'error',
                });
              }
            }
          });
        });
      });




  });
  