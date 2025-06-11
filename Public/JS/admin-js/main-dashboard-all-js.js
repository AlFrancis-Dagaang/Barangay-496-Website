// Sidebar menu functionality
const navBar = document.querySelector("nav"); // Check if the element exists
const menuBtns = document.querySelectorAll(".menu-icon"); // Ensure multiple elements
const overlay = document.querySelector(".overlay"); // Ensure this element exists

// Toggle the sidebar when menu buttons are clicked
if (navBar && menuBtns.length > 0) {
  menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
      navBar.classList.toggle("open");
    });
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      navBar.classList.remove("open");
    });
  } else {
    console.warn("Overlay not found.");
  }
} else {
  console.warn("Navigation bar or menu buttons not found.");
}

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve all sidebar links for navigation
  const sidebarLinks = document.querySelectorAll(".nav-link");

  // Retrieve all sections to control visibility
  const sections = document.querySelectorAll("section");

  // Function to hide all sections
  const hideAllSections = () => {
    sections.forEach((section) => {
      section.style.display = "none"; // Hide each section
    });
  };

  // Function to show a specific section by class name
  const showSection = (sectionClass) => {
    hideAllSections(); // Hide all sections before showing the selected one
    const section = document.querySelector(`.${sectionClass}`);
    if (section) {
      section.style.display = "block"; // Display the selected section
    } else {
      console.warn(`Section "${sectionClass}" not found.`);
    }
  };

  // Store the last viewed section in `localStorage`
  const setLastSection = (sectionClass) => {
    localStorage.setItem("lastSection", sectionClass); // Store the last viewed section
  };

  // Retrieve the last viewed section from `localStorage`
  const lastSection = localStorage.getItem("lastSection") || "admin-dashboard";
  showSection(lastSection); // Show the last viewed section

  // Add event listeners to sidebar links
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      const sectionClass = link.getAttribute("data-section");
      showSection(sectionClass); // Show the selected section
      setLastSection(sectionClass); // Store the last viewed section
    });
  });

  // Navigation logic for specific actions
  // Navigate to the Resident Section when "Total Residents" is clicked
  const totalResidentsView = document.querySelector(".view-section .view-residents");
  if (totalResidentsView) {
    totalResidentsView.addEventListener("click", () => {
      showSection("resident-section");
      setLastSection("resident-section");
    });
  }

  // Navigate to the Message Section when "View More" is clicked
  const viewMoreMessages = document.querySelector(".view-more");
  if (viewMoreMessages) {
    viewMoreMessages.addEventListener("click", () => {
      showSection("message-section");
      setLastSection("message-section");
    });
  }

  // Navigate to the To Verify Section when the "To Verify" view is clicked
  const verifySectionView = document.querySelector(".verify-view-section .view-residents");
  if (verifySectionView) {
    verifySectionView.addEventListener("click", () => {
      showSection("to-verify-section");
      setLastSection("to-verify-section");
    });
  }

  // Navigate to the Complaints Section when the "Complaints" view is clicked
  const complaintsSectionView = document.querySelector(".complaints-view-section .view-residents");
  if (complaintsSectionView) {
    complaintsSectionView.addEventListener("click", () => {
      showSection("complaints-section");
      setLastSection("complaints-section");
    });
  }

  // Navigate to the Online Requests Section when "Full View" is clicked
  const pendingRequestsView = document.querySelector(".second-conts .icon-second");
  if (pendingRequestsView) {
    pendingRequestsView.addEventListener("click", () => {
      showSection("online-request-section");
      setLastSection("online-request-section");
    });
  }

  // Navigate to the Appointments Section when the Appointments view is clicked
  const appointmentSectionView = document.querySelector(".appointment-view-section .view-residents");
  if (appointmentSectionView) {
    appointmentSectionView.addEventListener("click", () => {
      showSection("appointment-section");
      setLastSection("appointment-section");
    });
  }
});





// Online request page functionality
document.addEventListener("DOMContentLoaded", () => {
  const selectInput = document.getElementById("selectInput"); // Reference to the select input
  const allSections = document.querySelectorAll(".user-conts > div"); // All sections to toggle

  if (!selectInput) {
    console.warn("Select input not found.");
    return;
  }

  // Function to hide all sections
  const hideAllSections = () => {
    allSections.forEach((section) => {
      section.style.display = "none"; // Hide each section
    });
  };

  // Function to show a specific section based on its class
  const showSection = (sectionClass) => {
    const section = document.querySelector(`.${sectionClass}`); // Find the section with the specific class
    if (section) {
      section.style.display = "block"; // Display the section
    } else {
      console.warn(`Section with class "${sectionClass}" not found.`);
    }
  };

  // Event listener for select change
  selectInput.addEventListener("change", (event) => {
    const selectedValue = event.target.value; // Get the selected value
    hideAllSections(); // Hide all sections
    showSection(selectedValue); // Show the selected section
  });

  // Initial setup: show 'Pending'
  hideAllSections(); // Hide all sections initially
  showSection("Pending"); // Default to show 'Pending'
});






const statusColorMap = {
  pending: '#f4ce74',
  approved: '#4ec0fe',
  completed: '#1e8439',
  processing: '#dcc600',
  rejected: '#2e2f2f',
  cancelled: "rgb(149, 27, 27)",
  acknowledged: '#4ec0fe',
  resolved: '#1e8439',
  replied: '#4ec0fe',
};

// Get all elements with class 'online-status-conts'
const statusElements = document.querySelectorAll('.online-status-conts');

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

document.addEventListener('DOMContentLoaded', function() {
  const statusColorMap = {
      pending: '#f4ce74',
      approved: '#4ec0fe',
      completed: '#1e8439',
      processing: '#dcc600',
      rejected: '#2e2f2f',
      cancelled: "rgb(149, 27, 27)"
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


document.addEventListener('DOMContentLoaded', function () {
  // Get the select input within the complaint-Selectstatus section
  const selectInput = document.querySelector('.complaint-Selectstatus select');

  // Get all complaint sections
  const allComplaintSections = document.querySelectorAll('.user-conts-complaints > div');

  // Function to show the correct section based on its status
  const showSection = (status) => {
    allComplaintSections.forEach((section) => {
      // Get the section's class and ensure it's the one we want
      const sectionClassName = section.className.trim().toLowerCase();
      if (sectionClassName === status.toLowerCase()) {
        section.style.display = 'block'; // Show the matching section
      } else {
        section.style.display = 'none'; // Hide the others
      }
    });
  };

  // Retrieve the last selected status from localStorage (default to 'Pending' if none)
  const lastStatus = localStorage.getItem('lastComplaintStatus') || 'Pending';

  // Set the dropdown to the last status and show the correct section
  selectInput.value = lastStatus; // Set the dropdown's value
  showSection(lastStatus); // Display the correct section based on the stored status

  // Event listener for changes to the select input
  selectInput.addEventListener('change', function () {
    const selectedStatus = this.value; // Get the selected status
    showSection(selectedStatus); // Display the corresponding section
    localStorage.setItem('lastComplaintStatus', selectedStatus); // Store the last selected status in localStorage
  });
});


document.addEventListener('DOMContentLoaded', () => {
  // Get the current date
  const currentDate = new Date();

  // Get day, month, and year
  const day = currentDate.getDate(); // Day of the month (1-31)
  const year = currentDate.getFullYear(); // Current year
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const month = monthNames[currentDate.getMonth()]; // Get current month as a string
  const weekday = dayNames[currentDate.getDay()]; // Get current day of the week as a string

  // Update the days section
  const dayElement = document.querySelector('.appointment-conts .days .number');
  if (dayElement) {
    dayElement.innerText = day; // Set the day of the month
  }

  // Update the text section for the weekday
  const textElement = document.querySelector('.appointment-conts .days .text');
  if (textElement) {
    textElement.innerText = weekday; // Set the day of the week
  }

  // Update the month-year section
  const monthYearElement = document.querySelector('.appointment-conts .month-year');
  if (monthYearElement) {
    const [monthElement, yearElement] = monthYearElement.querySelectorAll('p');
    if (monthElement) {
      monthElement.innerText = month; // Set the current month
    }
    if (yearElement) {
      yearElement.innerText = year; // Set the current year
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Get the "Write" button and the email input
  const writeMessageButton = document.getElementById("writeMessage");
  const emailInput = document.querySelector(".input-message input[type='email']");
  const requiredMessage = document.querySelector(".snd-message");

  // Add event listener to the "Write" button
  writeMessageButton.addEventListener("click", (e) => {
    // Check if the email input is empty
    if (emailInput.value.trim() === "") {
      // If empty, show the "Required" message
      requiredMessage.style.visibility = "visible";
    } else {
      // If not empty, hide the "Required" message
      requiredMessage.style.visibility = "hidden";

      // Display Swal alert
      Swal.fire({
        html:`

        <div class="snd-mssg-cnts">
            <div class="snd-mssg-bx">
                <p>To: <span>${emailInput.value}</span></p>
                <textarea id="message-text"placeholder="write message here">
                </textarea>
            </div>
            <div class="snd-message-admin"><ion-icon name="alert-circle-outline"></ion-icon><p>Required</p></div >
            <button id="snd-mssg-email">Send</button>
        </div>

        `,
        customClass: {
                popup: 'send-message-swal', // This will apply your custom class
        },
        didOpen: (popup) => {
          // Add event listener to the "Send" button inside the Swal popup
          const sendMessageButton = popup.querySelector("#snd-mssg-email");
          const messageTextarea = popup.querySelector("#message-text");

          sendMessageButton.addEventListener("click", () => {
            const messageText = messageTextarea.value.trim();

            if (messageText === "") {
              // Show the "Required" message if textarea is empty
              const adminMessage = popup.querySelector(".snd-message-admin");
              adminMessage.style.visibility = "visible";
            } else {
              // Hide "Required" and send the message to the backend
              const recipientEmail = emailInput.value.trim();

              const loadingSwal = Swal.fire({
                allowOutsideClick: false, // Prevent closing by clicking outside
                showConfirmButton: false, // Hide the confirm button
                willOpen: () => {
                    Swal.showLoading(); // Show the loading spinner
                },
            });

              fetch("/send-email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: recipientEmail,
                  message: messageText,
                }),
              })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  loadingSwal.close();
                  Swal.fire({
                    title: "Message Sent",
                    text: "Your message has been sent.",
                    icon: "success",
                  });
                } else {
                  Swal.fire({
                    title: "Error",
                    text: "Failed to send the message.",
                    icon: "error",
                  });
                }
              })
              .catch((error) => {
                Swal.fire({
                  title: "Error",
                  text: "An error occurred while sending the message.",
                  icon: "error",
                });
              });
            }
          });
        },
        showConfirmButton: false,
        allowOutsideClick: true, // Optional, allow closing the popup by clicking outside
        });

    }
  });

  // Optionally, hide the "Required" message on key input
  emailInput.addEventListener("input", () => {
    requiredMessage.style.visibility = "hidden"; // Hide when typing
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the logout link
  const logoutLink = document.querySelector(".log-out");

  if (logoutLink) {
    // Add event listener to the logout link
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default anchor behavior

      // Show SweetAlert popup to confirm logout
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to log out?",
        icon: "warning",
        showCancelButton: true, // Show cancel button
        confirmButtonText: "Yes, log out",
        cancelButtonText: "Cancel",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'rgb(22, 21, 21)',
      }).then((result) => {
        if (result.isConfirmed) {
          // If user confirms, redirect to the home page
          window.location.href = "/home-page"; // Redirect to the desired URL
        }
      });
    });
  }
});
