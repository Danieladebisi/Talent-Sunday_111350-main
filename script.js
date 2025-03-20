document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const talentTypeSelect = document.getElementById('talentType');
    const otherTalentLabel = document.getElementById('otherTalentLabel');
    const otherTalentInput = document.getElementById('otherTalent');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentSlipLabel = document.getElementById('paymentSlipLabel');
    const paymentSlipInput = document.getElementById('paymentSlip');
    const transactionIdLabel = document.getElementById('transactionIdLabel');
    const transactionIdInput = document.getElementById('transactionId');
    const errorMessagesDiv = document.getElementById('errorMessages');

    // --- Talent Type Handling ---
    talentTypeSelect.addEventListener('change', function () {
        if (talentTypeSelect.value === 'other') {
            otherTalentLabel.style.display = 'block';
            otherTalentInput.style.display = 'block';
            otherTalentInput.setAttribute('required', 'required');
        } else {
            otherTalentLabel.style.display = 'none';
            otherTalentInput.style.display = 'none';
            otherTalentInput.removeAttribute('required');
        }
    });

    // --- Payment Method Handling ---
    paymentMethodSelect.addEventListener('change', function () {
        if (paymentMethodSelect.value === 'online') {
            paymentSlipLabel.style.display = 'block';
            paymentSlipInput.style.display = 'block';
            paymentSlipInput.setAttribute('required', 'required');
            transactionIdLabel.style.display = 'block';
            transactionIdInput.style.display = 'block';
            transactionIdInput.setAttribute('required', 'required');
        } else {
            paymentSlipLabel.style.display = 'none';
            paymentSlipInput.style.display = 'none';
            paymentSlipInput.removeAttribute('required');
            transactionIdLabel.style.display = 'none';
            transactionIdInput.style.display = 'none';
            transactionIdInput.removeAttribute('required');
        }
    });

    // --- Form Submission Handling ---
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        clearErrors(); // Clear previous errors

        let errors = [];

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
        if (paymentMethodSelect.value === '') {
            errors.push('Payment Method is required.');
        }

        // Payment Slip and Transaction ID (if applicable)
        if (paymentMethodSelect.value === 'online') {
            if (!paymentSlipInput.files || paymentSlipInput.files.length === 0) {
                errors.push('Payment Slip is required for Online payments.');
            }
            if (transactionIdInput.value.trim() === '') {
                errors.push('Transaction ID is required for Online payments.');
            }
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
            displayErrors(errors); // Display errors
        } else {
            // If no errors, proceed with form submission (EmailJS)
            sendEmail(form);
        }
    });

    // --- Helper Functions ---

    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to display error messages
    function displayErrors(errors) {
        let errorList = '<ul>';
        errors.forEach(error => {
            errorList += `<li>${error}</li>`;
        });
        errorList += '</ul>';
        errorMessagesDiv.innerHTML = errorList;
        errorMessagesDiv.style.display = 'block';
    }

    // Function to clear error messages
    function clearErrors() {
        errorMessagesDiv.innerHTML = '';
        errorMessagesDiv.style.display = 'none';
    }

    // --- EmailJS Integration ---
    function sendEmail(form) {
        // Collect form data
        const formData = new FormData(form);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        // EmailJS parameters
        const templateParams = {
            ...formDataObject,
            // You can add other parameters here if needed
        };

        // Send the email using EmailJS
        emailjs.send("service_YOUR_SERVICE_ID", "template_YOUR_TEMPLATE_ID", templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Registration successful! We have sent you a confirmation email.');
                form.reset(); // Reset the form
            }, function (error) {
                console.error('FAILED...', error);
                alert('Registration failed. Please try again.');
            });
    }
});