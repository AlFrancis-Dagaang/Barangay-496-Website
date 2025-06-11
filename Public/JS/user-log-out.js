document.getElementById('user-logout').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior

    Swal.fire({
        title: 'Are you sure you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'rgb(22, 21, 21)',
        confirmButtonText: 'Log out',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Perform logout action
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ logout: true })
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to the login page
                    window.location.href = '/';
                } else {
                    // Error message
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong! Please try again.',
                        showConfirmButton: false,
                        timer: 1500 // Automatically close after 1.5 seconds
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Error message
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again.',
                    showConfirmButton: false,
                    timer: 1500 // Automatically close after 1.5 seconds
                });
            });
        }
    });
});
