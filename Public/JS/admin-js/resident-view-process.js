document.addEventListener('DOMContentLoaded', () => {
    const residentElements = document.querySelectorAll('.resident-conts'); // Select all resident-conts
  
    residentElements.forEach((element) => {
      element.addEventListener('click', async () => {
        // Get the data-email from the clicked resident-conts
        const email = element.getAttribute('data-email');
        const profileImage = element.getAttribute('data-profileImage');
  
        try {
          // Send the email to the backend to fetch the resident's information
          const response = await fetch('/get-resident-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }), // Send email to the backend
          });
  
          if (response.ok) {
            const residentData = await response.json(); // Parse the response data
  
            // Determine the content based on the status
            const infoContent = residentData.status === 'notVerified' ? `
              <div class="no-info">
                <div>No Information</div>
              </div>
            ` : `
              <div>
                <div class="bold">Full Name:</div>
                <div class="normal">${residentData.fullName || 'N/A'}</div>
              </div>
              <div>
                <div class="bold">Birth-Date:</div>
                <div class="normal">${residentData.birthDate || 'N/A'}</div>
              </div>
              <div>
                <div class="bold">Sex:</div>
                <div class="normal">${residentData.sex || 'N/A'}</div>
              </div>
              <div>
                <div class="bold">Address:</div>
                <div class="normal">${residentData.address || 'N/A'}</div>
              </div>
            `;
    
            Swal.fire({
              html: `
              <div class="rsdnt-main-conts">
                <div class="rsdnt-heading">User Information</div>
                <div class="rsdnt-info-section">
                  <div class="rsdnt-pfle">
                    <div class="cnts">
                      <div id="img"><img src="${profileImage || 'default.jpg'}" alt="Resident Photo"></div>
                      <div id="username">${residentData.userName}</div>
                      <div id="email">${residentData.email}</div>
                      ${residentData.status === 'verified' ? `
                      <div id="verify-icon">
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        Verified Resident
                      </div>
                    ` : `
                      <div id="not-verify-icon">
                        <ion-icon name="close-circle-outline"></ion-icon>
                        Not Verified
                      </div>
                    `}
                    </div>
                  </div>
                  <div class="rsdnt-info">
                    ${infoContent} <!-- Insert the dynamic content -->
                  </div>
                </div>
                <div class="footer">
                </div>
              </div>
              `,
              customClass: {
                popup: 'user-record-swal', // Apply your custom class
              },
              showConfirmButton: false,
              allowOutsideClick: true, // Optional, allow closing the popup by clicking outside
            });
          } else {
            throw new Error('Failed to fetch resident information');
          }
        } catch (error) {
          console.error('Error fetching resident information:', error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while fetching resident information.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
    });
  });
  

  document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-bar input"); // Get the input field
    const searchContainers = document.querySelectorAll(".for-searching"); // Get all for-searching divs
    const noDataType = document.querySelector(".noData-Type"); // Get the no match found div
    
    // Function to filter residents based on the search query
    const filterResidents = (query) => {
      const lowerQuery = query.toLowerCase(); // Convert to lowercase for case-insensitive matching
      let hasMatch = false; // Track if there are any matches
    
      searchContainers.forEach((container) => {
        const residentElement = container.querySelector(".resident-conts");
        const username = residentElement.querySelector("#username").innerText.toLowerCase(); // Get the username text
        const email = residentElement.getAttribute("data-email").toLowerCase(); // Get the email from the data attribute
        
        if (username.includes(lowerQuery) || email.includes(lowerQuery)) {
          container.style.display = "block"; // Show if the query matches
          hasMatch = true; // Set hasMatch to true if there is a match
        } else {
          container.style.display = "none"; // Hide if it doesn't match
        }
      });
      
      // Show or hide the no match found message
      if (hasMatch) {
        noDataType.style.display = "none"; // Hide if there are matches
      } else {
        noDataType.style.display = "block"; // Show if there are no matches
      }
    };
  
    // Add an event listener for input changes
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.trim(); // Get the current search term
      filterResidents(searchTerm); // Filter based on the search term
    });
  
    // To initialize and show all by default
    filterResidents(""); // Show all residents on page load
  });
  
  

