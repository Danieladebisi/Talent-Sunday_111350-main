document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const talentTypeSelect = document.getElementById('talentType');
    const otherTalentGroup = document.getElementById('otherTalentGroup');
    const otherTalentInput = document.getElementById('otherTalent');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const cashDetails = document.getElementById('cashDetails');
    const transferDetails = document.getElementById('transferDetails');
    const transferNameGroup = document.getElementById('transferNameGroup');
    const transactionNameInput = document.getElementById('transactionName');
    const errorMessagesDiv = document.getElementById('errorMessages');

    // Function to display error messages
    function displayError(message) {
        errorMessagesDiv.textContent = message;
        errorMessagesDiv.style.display = 'block';
    }

    // Function to clear error messages
    function clearErrors() {
        errorMessagesDiv.textContent = '';
        errorMessagesDiv.style.display = 'none';
    }

    // Talent Type Change Handler
    talentTypeSelect.addEventListener('change', () => {
        if (talentTypeSelect.value === 'other') {
            otherTalentGroup.style.display = 'flex';
            otherTalentInput.setAttribute('required', 'required');
        } else {
            otherTalentGroup.style.display = 'none';
            otherTalentInput.removeAttribute('required');
        }
    });

    // Payment Method Change Handler
    paymentMethodSelect.addEventListener('change', () => {
        if (paymentMethodSelect.value === 'cash') {
            cashDetails.style.display = 'block';
            transferDetails.style.display = 'none';
            transferNameGroup.style.display = 'none';
            transactionNameInput.removeAttribute('required');
        } else if (paymentMethodSelect.value === 'transfer') {
            cashDetails.style.display = 'none';
            transferDetails.style.display = 'block';
            transferNameGroup.style.display = 'flex';
            transactionNameInput.setAttribute('required', 'required');
        } else {
            cashDetails.style.display = 'none';
            transferDetails.style.display = 'none';
            transferNameGroup.style.display = 'none';
            transactionNameInput.removeAttribute('required');
        }
    });

    // Form Submission Handler
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        clearErrors(); // Clear any previous error messages

        // Collect form data
        const formData = new FormData(form);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        //  ***IMPORTANT: Replace with your EmailJS credentials***
        emailjs.send(
            'service_xl3wr8l', //  <----  YOUR Service ID
            'template_7ktedtm', //  <----  YOUR Template ID
            formDataObject,
            'm5cA-okHHGdZuWJoh'    //  <----  YOUR Public Key
        )
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                alert('Registration submitted successfully!');
                form.reset();

                // Hide additional fields after successful submission
                otherTalentGroup.style.display = 'none';
                cashDetails.style.display = 'none';
                transferDetails.style.display = 'none';
                transferNameGroup.style.display = 'none';

            }, (err) => {
                console.log('FAILED...', err);
                displayError('Error submitting form. Please try again.');
            });
    });
});