// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', function () {
    // Get references to the form and relevant elements by their correct IDs
    const form = document.getElementById('registrationForm');
    const talentTypeSelect = document.getElementById('talentType');
    // Corrected: Get the group div for 'Other Talent'
    const otherTalentGroup = document.getElementById('otherTalentGroup');
    const otherTalentInput = document.getElementById('otherTalent');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    // Corrected: Get the divs for cash/transfer details and the transaction name input group/input
    const cashDetails = document.getElementById('cashDetails');
    const transferDetails = document.getElementById('transferDetails');
    const transferNameGroup = document.getElementById('transferNameGroup');
    const transactionNameInput = document.getElementById('transactionName');
    const errorMessagesDiv = document.getElementById('errorMessages');

    // --- Talent Type Handling ---
    // Show/hide the 'Other Talent' input field based on selection
    talentTypeSelect.addEventListener('change', function () {
        if (talentTypeSelect.value === 'other') {
            // Corrected: Show the group div
            otherTalentGroup.style.display = 'block';
            otherTalentInput.setAttribute('required', 'required'); // Make input required
        } else {
            // Corrected: Hide the group div
            otherTalentGroup.style.display = 'none';
            otherTalentInput.removeAttribute('required'); // Make input not required
            otherTalentInput.value = ''; // Clear the input if hidden
        }
    });

    // --- Payment Method Handling ---
    // Show/hide payment details based on the selected method ('cash' or 'transfer')
    paymentMethodSelect.addEventListener('change', function () {
        const selectedMethod = paymentMethodSelect.value;

        // Show/hide relevant sections based on selection
        cashDetails.style.display = selectedMethod === 'cash' ? 'block' : 'none';
        transferDetails.style.display = selectedMethod === 'transfer' ? 'block' : 'none';
        transferNameGroup.style.display = selectedMethod === 'transfer' ? 'block' : 'none';

        // Make 'Name on Transaction' required only if 'Transfer' is selected
        if (selectedMethod === 'transfer') {
            transactionNameInput.setAttribute('required', 'required');
        } else {
            transactionNameInput.removeAttribute('required');
            transactionNameInput.value = ''; // Clear the input if not required
        }
    });

    // --- Form Submission Handling ---
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission behavior
        clearErrors(); // Clear any previous error messages

        let errors = []; // Initialize an array to hold validation errors

        // --- Validation ---
        // Full Name
        const fullName = form.elements['fullName'].value.trim();
        if (fullName === '') {
            errors.push('Full Name is required.');
        }

        // Phone Number
        const phone = form.elements['phone'].value.trim();
        if (phone === '') {
            errors.push('Phone Number is required.');
        }

        // Email Address
        const email = form.elements['email'].value.trim();
        if (email === '') {
            errors.push('Email Address is required.');
        } else if (!isValidEmail(email)) {
            errors.push('Invalid Email Address.');
        }

        // Talent Type
        if (talentTypeSelect.value === '') {
            errors.push('Talent Type is required.');
        }

        // Other Talent (if applicable)
        if (talentTypeSelect.value === 'other' && otherTalentInput.value.trim() === '') {
            errors.push('Please specify the Other Talent.');
        }

        // Performance Description
        const performanceDescription = form.elements['performanceDescription'].value.trim();
        if (performanceDescription === '') {
            errors.push('Performance Description is required.');
        }

        // Payment Method
        const paymentMethod = paymentMethodSelect.value;
        if (paymentMethod === '') {
            errors.push('Payment Method is required.');
        }

        // Corrected: Transaction Name (if applicable)
        if (paymentMethod === 'transfer' && transactionNameInput.value.trim() === '') {
            errors.push('Name on Transaction is required for Transfer payments.');
        }

        // Rules Confirmation
        if (!form.elements['rulesConfirmation'].checked) {
            errors.push('You must agree to the rules and regulations.');
        }

        // Consent Confirmation
        if (!form.elements['consentConfirmation'].checked) {
            errors.push('You must consent to recording and photographing.');
        }

        // --- Error Display or Submission ---
        if (errors.length > 0) {
            displayErrors(errors); // Display errors if any were found
        } else {
            // If no errors, proceed with form submission using EmailJS
            sendEmail(form);
        }
    });

    // --- Helper Functions ---

    // Function to validate email format using a simple regex
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to display error messages in the designated div
    function displayErrors(errors) {
        let errorList = '<ul>';
        errors.forEach(error => {
            errorList += `<li>${error}</li>`;
        });
        errorList += '</ul>';
        errorMessagesDiv.innerHTML = errorList;
        errorMessagesDiv.style.display = 'block'; // Make errors visible
    }

    // Function to clear error messages
    function clearErrors() {
        errorMessagesDiv.innerHTML = '';
        errorMessagesDiv.style.display = 'none'; // Hide the error container
    }

    // --- EmailJS Integration ---
    function sendEmail(form) {
        // Show some processing indication (optional)
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';


        // Collect form data into an object
        const formData = new FormData(form);
        const formDataObject = {};
        formData.forEach((value, key) => {
            // Skip file inputs if any were accidentally left (EmailJS sends field data)
            if (!(value instanceof File)) {
                 formDataObject[key] = value;
            }
        });

        // EmailJS parameters (data to be sent to your template)
        const templateParams = {
            ...formDataObject,
            // Add any other specific parameters your EmailJS template expects
            // e.g., to_name: "Admin"
        };

        // !!! IMPORTANT: Replace placeholders with your actual EmailJS Service ID and Template ID !!!
        const emailJsServiceId = "service_YOUR_SERVICE_ID"; // <-- Replace with your Service ID
        const emailJsTemplateId = "template_YOUR_TEMPLATE_ID"; // <-- Replace with your Template ID

        // Send the email using EmailJS
        emailjs.send(emailJsServiceId, emailJsTemplateId, templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Registration successful! Thank you.'); // Inform user
                form.reset(); // Reset the form fields
                // Manually hide conditional fields again after reset
                otherTalentGroup.style.display = 'none';
                cashDetails.style.display = 'none';
                transferDetails.style.display = 'none';
                transferNameGroup.style.display = 'none';
                clearErrors(); // Clear errors on success
            }, function (error) {
                console.error('FAILED...', error);
                // Display a more specific error if possible, otherwise generic
                let errorMsg = 'Registration failed. Please try again.';
                if (error.status === 400) {
                   errorMsg += ' (Check EmailJS configuration - Service/Template ID)';
                }
                 // Display error using the error div
                displayErrors([errorMsg]);
                alert(errorMsg); // Also alert the user
            })
            .finally(function() {
                 // Restore button state whether success or failure
                 submitButton.disabled = false;
                 submitButton.innerHTML = originalButtonText;
            });
    }
}); // End of DOMContentLoaded
