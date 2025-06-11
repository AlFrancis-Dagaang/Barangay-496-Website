document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete"); // Select all elements with the 'delete' class

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Prevent default click behavior
      event.stopPropagation();
      event.preventDefault();

      const parentConts = button.closest(".each-user-conts"); // Get the parent container
      const email = parentConts.getAttribute("data-email"); // Extract data-email

      // Show SweetAlert confirmation dialog
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'rgb(22, 21, 21)',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // Send a DELETE request with the email to the backend
          fetch(`/delete-verification/${email}`, {
            method: 'DELETE',
          })
          .then((response) => {
            if (response.ok) {
              Swal.fire({
                title: 'Success!',
                text: 'Verification was removed.',
                icon: 'success',
              }).then(() => {
                location.reload(); // Reload the page after the user confirms
              });
            } else {
              console.error('Error deleting item');
            }
          })
          .catch((error) => {
            console.error('Error during deletion:', error);
          });
        }
      });
    });
  });
});




document.addEventListener("DOMContentLoaded", () => {

        // Function to update the text color based on status
        function updateStatusBackground(statusText, element) {
            if (statusText === "Approved") {
              element.style.backgroundColor = "rgb(6, 123, 8)"; // Green for approved
              element.style.color = "white"; // Green for approved

            } else if (statusText === "To Verify") {
              element.style.backgroundColor = "#f4ce74"; // Yellow for to verify
            }
            else if (statusText === "Rejected") {
              element.style.backgroundColor = "black"; // Yellow for to verify
              element.style.color = "white";
            }
          }
    
            // Assuming you have a reference to the parent container or status-conts
            const parentConts = document.querySelectorAll('.status-conts'); // Get the status-conts element
            
            parentConts.forEach

            parentConts.forEach((div) => {
              const statusText =div.innerText.trim(); 
              updateStatusBackground(statusText, div); 
            });
   











    function sendActionToBackend(email, action, message = '') {


        console.log(email, action);

        const loadingSwal = Swal.fire({
          allowOutsideClick: false, // Prevent closing by clicking outside
          showConfirmButton: false, // Hide the confirm button
          willOpen: () => {
              Swal.showLoading(); // Show the loading spinner
          },
      });

      const requestBody = { email, action };
      if (message) {
          requestBody.message = message;
      }

        fetch('/Verified-or-Rejected', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            if (response.ok) {
              if(action === "accept"){
                loadingSwal.close();
                console.log('Action sent successfully');
        
                // Show a SweetAlert for successful action
                Swal.fire({
                  title: 'Success!',
                  text: `Successfully verified this email: ${email}`,
                  icon: 'success',
                  showConfirmButton: true, // Display confirm button
                  confirmButtonText: 'OK', // Customize confirm button text
                  confirmButtonColor: 'rgb(22, 21, 21)',
                }).then(() => {
                  // Delay the reload by a certain number of milliseconds
                  setTimeout(() => {
                    window.location.reload(); // Reload the page
                  }, 200); // 1000 milliseconds = 1 second
                });
              }else{
                loadingSwal.close();
                Swal.fire({
                  text: `You rejected  this email: ${email}`,
                  confirmButtonText: 'OK',
                }).then(() => {
                  // Delay the reload by a certain number of milliseconds
                  setTimeout(() => {
                    window.location.reload(); // Reload the page
                  }, 200); // 1000 milliseconds = 1 second
                });
              }
            } else {
              console.error('Failed to send action');
              Swal.fire({
                title: 'Error',
                text: 'Failed to send action',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          })
          .catch((error) => {
            console.error('Error sending action:', error);
            Swal.fire({
              title: 'Error',
              text: 'Error sending action',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          });
      }
      

        // Function to generate a resident block with a custom data attribute
    function generateResidentBlock(userData) {
        const block = document.createElement('div'); // Create a new div element
        block.className = 'residents-conts-block'; // Assign the class name
        block.setAttribute('data-fullname', userData.fullName); // Set the custom attribute with the full name
        
        // HTML content for the resident block
        const content = `
        <div class="resident-each-container">
            <div class="text"><h5>${userData.fullName}</h5></div>  <!-- Full name -->
            <div class="text"><h5>${userData.address}</h5></div> <!-- Address -->
            <div class="action" id="peekInfo">
            <ion-icon size="large" name="eye-outline"></ion-icon> <!-- Example action -->
            </div>
        </div>
        `;
        
        block.innerHTML = content; // Set the HTML content
        return block; // Return the complete block
    }

    

    const verifyIcons = document.querySelectorAll(".each-user-conts .search");
  
    verifyIcons.forEach((icon) => {
      icon.addEventListener("click", async () => {
        const parentConts = icon.closest(".each-user-conts");
        const email = parentConts.getAttribute("data-email"); // Get the email from data attribute
  
        try {
          // Send a GET request to the backend route with the email
          const response = await fetch(`/verification/${email}`);
  
          if (response.ok) {
            const combinedData = await response.json(); // Parse the response data
            const verification = combinedData.verification; 
            const allUserData = combinedData.allUserData;


            let allUserDataHTML = ''; // To store all generated HTML blocks

            if (allUserData && allUserData.length > 0) {
              allUserData.forEach((user) => {
                const residentBlock = generateResidentBlock(user); // Generate each block
                allUserDataHTML += residentBlock.outerHTML; // Get the HTML content of the block
              });
            } else {
              allUserDataHTML = '<div class="no-match-conts">No match found</div>'; // No data message
            }


  
            Swal.fire({
                html:
                `
                <div class="main-conts">
                <div id="user-info-sub-conts">
                <div class="user-info-heading">
                    User Information
                </div>
                <div class="user-info-content">
                    <div class="user-picture">
                        <img src="${verification.id}" alt="User Picture" /> <!-- Use the ID image -->
                    </div>
                    <div class="user-input-placeHolder">
                        <div id="full-name">
                            <p>Full name: </p>
                            <div class="value">
                                <p>${verification.fullName}</p> <!-- Display dynamic full name -->
                            </div>
                        </div>
                        <div id="birth-date">
                            <p>Birth-Date: </p>
                            <div class="value">
                                <p>${verification.birthdate}</p> <!-- Display dynamic birthdate -->
                            </div>
                        </div>
                        <div id="sex">
                            <p>Sex: </p>
                            <div class="value">
                                <p>${verification.sex}</p> <!-- Display dynamic sex -->
                            </div>
                        </div>
                        <div id="email">
                            <p>Email: </p>
                            <div class="value">
                                <p>${verification.email}</p> <!-- Display dynamic email -->
                            </div>
                        </div>
                        <div id="address">
                            <p>Address: </p>
                            <div class="value">
                                <p>${verification.address}</p> <!-- Display dynamic address -->
                            </div>
                        </div>
                    </div>
                    <div class="buttons">
                        <button id="accept">Accept</button> <!-- Action buttons -->
                        <button id="reject">Reject</button>
                    </div>
                </div>
            </div>









                    <div id="search-database-sub-conts">
                        <div class="search-heading">
                            Search User
                        </div>
                        <div class="search-content">
                            <div class="search-bar-conts">
                                <div class="search-bar">
                                    <input type="text" id="search-input" placeholder="Enter name">
                                    <ion-icon size="large"name="search-outline"></ion-icon>
                                </div>
                            </div>
                            <div class="classification">
                                    <h5>Full name</h5>
                                    <h5>Adress</h5>
                                    <h5>Action</h5>
                                </div>
                            <div class="changing-div">
                                <div id="residents-container">${allUserDataHTML}</div> <!-- All user blocks -->
                                <div id="no-match" style="display: none;">
                                    <div class="no-match-conts">No match found</div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>


                `,
                customClass: {
                    popup: 'verify-custom-swal', // This will apply your custom class
                },
                showConfirmButton: false,
                allowOutsideClick: true, // Allows clicking outside to close
                hideClass: {
                    popup: 'my-fade-out', // Custom fade-out animation
                },
                didOpen: function () {
                    const changingDiv = document.querySelector(".changing-div");
                
                    // Function to attach search and peekInfo event listeners
                    function attachEventListeners() {
                      // Search functionality
                      const searchInput = document.getElementById("search-input");
                      const residentsContainer = document.getElementById("residents-container");
                      const noMatch = document.getElementById("no-match");
                
                      searchInput.addEventListener("input", function () {
                        const searchValue = searchInput.value.trim().toLowerCase();
                        const residentsBlocks = Array.from(
                          residentsContainer.getElementsByClassName("residents-conts-block")
                        );
                
                        let anyVisible = false;
                
                        residentsBlocks.forEach((block) => {
                          const residentName = block
                            .getAttribute("data-fullname")
                            .trim()
                            .toLowerCase();
                
                          if (residentName.includes(searchValue)) {
                            block.style.display = "block"; // Show if it matches
                            anyVisible = true;
                          } else {
                            block.style.display = "none"; // Hide if it doesn't match
                          }
                        });
                
                        noMatch.style.display = anyVisible ? "none" : "block"; // Show 'no match' if nothing is visible
                      });
                
                      // Peek functionality for the "eye-outline" icon
                      residentsContainer.addEventListener("click", function (event) {
                        if (event.target.closest("#peekInfo")) { // Check if the clicked element is "eye-outline"
                          const block = event.target.closest(".residents-conts-block");
                          const dataFullName = block.getAttribute("data-fullname");
                          const user = allUserData.find(
                            (u) => u.fullName.toLowerCase() === dataFullName.toLowerCase()
                          ); // Find the matching user data
                
                          if (user) {
                            // Display full information
                            changingDiv.innerHTML = `
                              <div class="existData-conts">
                                <div class="existData-heading">Resident Information</div>
                                <div class="user-input-placeHolder">
                                  <div id="full-name">
                                    <p>Full name: </p>
                                    <div class="value">
                                      <p>${user.fullName}</p> <!-- User's full name -->
                                    </div>
                                  </div>
                                  <div id="birth-date">
                                    <p>Birth-Date: </p>
                                    <div class="value">
                                      <p>${user.birthdate}</p> <!-- User's birthdate -->
                                    </div>
                                  </div>
                                  <div id="sex">
                                    <p>Sex: </p>
                                    <div class="value">
                                      <p>${user.sex}</p> <!-- User's sex -->
                                    </div>
                                  </div>
                                  <div id="address">
                                    <p>Address: </p>
                                    <div class="value">
                                      <p>${user.address}</p> <!-- User's address -->
                                    </div>
                                  </div>
                                </div>
                                <div class="buttons">
                                  <button id="return">Return</button> <!-- Button to return -->
                                </div>
                              </div>
                            `;
                
                            // Return button functionality to revert to the original list
                            document.getElementById("return").addEventListener("click", function () {
                              changingDiv.innerHTML = `
                                <div id="residents-container">${allUserDataHTML}</div>
                                <div id="no-match" style="display: none;">
                                  <div class="no-match-conts">No match found</div>
                                </div>
                              `;
                
                              // Reattach event listeners to maintain search and peek functionality
                              attachEventListeners(); // Call the function to reattach listeners

                            });
                          }
                        }
                      });
                    }
                
                    attachEventListeners(); // Attach event listeners on open
                    document.getElementById("accept").addEventListener("click", function () {
                        sendActionToBackend(email, 'accept'); // Function to send action
                      });
        
                      document.getElementById("reject").addEventListener("click", function () {

                        Swal.fire({
                          customClass: {
                              popup: 'resolved-information', // Custom fade-out animation
                          },
                          showConfirmButton: false,
                          html: `
                          <div class="rslvd-cnts">
                          <h2>Please provide details for rejection</h2>

                          <div class="text-area">
                              <textarea id="txt"placeholder="provide any details"> </textarea>
                          </div>
                          <p id="rqr"><ion-icon name="alert-circle-outline"></ion-icon>Required</p>
                          <button id="resolve-complete" class="rejected-complete">Rejected Complete</button> 
                          </div>
                          `,
                        });

                      document.querySelector(".rejected-complete").addEventListener("click", function () {
                        const rejectionMessage = document.getElementById('txt').value.trim();

                        const message= document.getElementById('rqr');
                        if(!rejectionMessage){
                            message.style.visibility = "visible";
                            return;
                        }
                        sendActionToBackend(email, 'reject', rejectionMessage); 
                      });
                      });
                  },
                });
          } else {
            Swal.fire({
              title: "Error",
              text: "Verification record not found",
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to fetch verification data",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      });
    });
});
  