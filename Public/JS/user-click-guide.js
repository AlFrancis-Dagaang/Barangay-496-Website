document.querySelectorAll('.learn-more').forEach(item => {
    item.addEventListener('click', event => {
        // Determine which section was clicked and set the HTML content accordingly
        let htmlContent;

        if (item.classList.contains('how-to-request')) {
            htmlContent = `
            <div class="lrn-cnts">
                <div class="hdr">Request Documents</div>
                <div class="stp1 stps">
                    <div class="nos">1</div>
                    <div class="des">Click the type of document you want to request 
                        <img src="/images/user-guide/click.png"></div>
                </div>
                <div class="stp2 stps">
                    <div class="nos">2</div>
                    <div class="des">Fill up all the required information
                    <img src="/images/user-guide/form.png"></div>
                </div>
                <div class="stp3 stps">
                    <div class="nos">3</div>
                    <div class="des">Wait for the approval of the Barangay Admin
                        <img src="/images/user-guide/approved.png"></div>
                </div>
                <div class="stp4 stps">
                    <div class="nos">4</div>
                    <div class="des">Set an appointment
                        <img src="/images/user-guide/appointment.png"></div>
                </div>
            </div>
            `;
        } else if (item.classList.contains('how-to-appoint')) {
            htmlContent = `      <div class="lrn-cnts">
            <div class="hdr">Set Appointment</div>
            <div class="stp1 stps">
                <div class="nos">1</div>
                <div class="des">Enter the appointment code of your document
                    <img src="/images/user-guide/enter-code.png"></div>
            </div>
            <div class="stp2 stps">
                <div class="nos">2</div>
                <div class="des">Check your document information before proceeding
                <img src="/images/user-guide/check-document.png"></div>
            </div>
            <div class="stp3 stps">
                <div class="nos">3</div>
                <div class="des">Proceed to set appoinment
                    <img src="/images/user-guide/set-appoint.png"></div>
            </div>
            <div class="stp4 stps">
                <div class="nos">4</div>
                <div class="des">Set your appointment date to complete the appointment
                    <img src="/images/user-guide/set-date.png"></div>
            </div>
        </div>
        `;
        } else if (item.classList.contains('how-to-complaint')) {
            htmlContent = ` <div class="lrn-cnts">
            <div class="hdr">Write Complaint</div>
            <div class="stp1 stps">
                <div class="nos">1</div>
                <div class="des">Fill up all the required information
                    <img src="/images/user-guide/form.png"></div>
            </div>
            <div class="stp2 stps">
                <div class="nos">2</div>
                <div class="des">Select your complaint category
                <img src="/images/user-guide/click.png"></div>
            </div>
            <div class="stp3 stps">
                <div class="nos">3</div>
                <div class="des">Provide any details for your complaint 
                    <img src="/images/user-guide/details.png"></div>
            </div>
            <div class="stp4 stps">
                <div class="nos">4</div>
                <div class="des">Complete the complaint by submition
                    <img src="/images/user-guide/submit.png"></div>
            </div>
        </div>
        `;
        }

        // Display the Swal alert with the HTML content
        Swal.fire({
            html: htmlContent,
            customClass: {
                popup: 'learn-more-swal', // This will apply your custom class
        },
        showConfirmButton: false,
        });
    });
});
