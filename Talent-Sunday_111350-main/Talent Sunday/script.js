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
    const submitButton = document.querySelector('button[type="submit"]');

    function displayError(message) {
        errorMessagesDiv.textContent = message;
        errorMessagesDiv.style.display = 'block';
    }

    function clearErrors() {
        errorMessagesDiv.textContent = '';
        errorMessagesDiv.style.display = 'none';
    }

    talentTypeSelect.addEventListener('change', () => {
        if (talentTypeSelect.value === 'other') {
            otherTalentGroup.style.display = 'flex';
            otherTalentInput.setAttribute('required', 'required');
        } else {
            otherTalentGroup.style.display = 'none';
            otherTalentInput.removeAttribute('required');
        }
    });

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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        clearErrors();

        submitButton.classList.add('processing');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        const formData = new FormData(form);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        try {
            const response = await emailjs.send(
                'service_xl3wr8l',
                'template_7ktedtm',
                formDataObject,
                'm5cA-okHHGdZuWJoh'
            );

            console.log('SUCCESS!', response.status, response.text);
            alert('Registration submitted successfully!');
            form.reset();

            otherTalentGroup.style.display = 'none';
            cashDetails.style.display = 'none';
            transferDetails.style.display = 'none';
            transferNameGroup.style.display = 'none';
        } catch (err) {
            console.log('FAILED...', err);
            displayError('Error submitting form. Please try again.');
        } finally {
            submitButton.classList.remove('processing');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Registration';
        }
    });
});