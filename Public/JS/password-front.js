document.querySelector('.submit-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
  
    // Your validation logic here...
    // Ensure all required fields are filled
  
    const email = document.querySelector('.email').value;
    const password = document.getElementById('password').value;
  
    // Check if any required field is empty
    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention!',
        text: 'Email and Password are required!',
        showConfirmButton: true, // Display confirm button
        confirmButtonText: 'OK', // Customize confirm button text
        confirmButtonColor: 'rgb(22, 21, 21)',
      });
      
      return;
    }
  
    // Proceed with form submission
    const formData = {
      email,
      password,
    };
  
    // Make a POST request to the server to submit the form data
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        return response.json().then(data => {
          document.querySelector('.message-password').innerHTML = `${data.error}`;
        });
      } else{
        alert('Error logging in. Please try again later.');
      }
    })
    .then(data => {
      if (data.userType === 'admin') {
        window.location.href = '/admin-page';
      } else if (data.userType === 'resident') {
        window.location.href = '/home';
      }
    })
    .catch(error => {
      console.error('Error submitting login form:', error.message);
      
    });
  });