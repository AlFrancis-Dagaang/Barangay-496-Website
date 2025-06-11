document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('.contact-form'); // Unique class for the form
    const inputs = form.querySelectorAll(".input-box input, .text-area textarea");
    const messages = form.querySelectorAll(".cntc-message"); // Updated error message class
    const submitButton = form.querySelector(".contact-button"); // Unique class for the submit button
  
    // Function to validate inputs and display error messages
    const validateFields = () => {
      let isValid = true;
  
      inputs.forEach((input, index) => {
        if (input.value.trim() === "") {
          isValid = false;
          messages[index].style.visibility = "visible"; // Show the error message
        } else {
          messages[index].style.visibility = "hidden"; // Hide the error message
        }
      });
  
      return isValid; // Return whether all fields are valid
    };
  
    // Event listener for blur (losing focus)
    inputs.forEach((input, index) => {
      input.addEventListener("blur", () => {
        if (input.value.trim() === "") {
          messages[index].style.visibility = "visible"; // Show error on blur if empty
        } else {
          messages[index].style.visibility = "hidden"; // Hide if not empty
        }
      });
    });
  
    // Event listener for the submit button
    submitButton.addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent form from submitting by default
  
      if (validateFields()) { // Check if all fields are valid
        const data = {
          name: form.querySelector(".contact-name").value.trim(),
          email: form.querySelector(".contact-email").value.trim(),
          message: form.querySelector(".contact-message").value.trim(),
        };
  
        try {
          const response = await fetch("/submit-contact-form", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
  
          if (response.ok) {
            Swal.fire({
              title: "Message Sent!",
              text: "Your message has been sent successfully.",
              icon: "success",
              showConfirmButton: true, // Display confirm button
              confirmButtonText: 'OK', // Customize confirm button text
              confirmButtonColor: 'rgb(22, 21, 21)',
            });
  
            // Clear the input fields
            inputs.forEach((input) => {
              input.value = ""; // Clear each input field
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "An error occurred while sending your message. Please try again.",
              icon: "error",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "An unexpected error occurred.",
            icon: "error",
          });
        }
      }
    });
  });
  