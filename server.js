const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Route to handle form submissions
app.post('/send-email', async (req, res) => {
    try {
        // Extract data from the request body
        const {
            fullName,
            email,
            ...formData
        } = req.body;

        //  ***SECURE: Nodemailer Setup with YOUR Gmail App Password***
        //  Replace with your actual Gmail address and App Password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-gmail@gmail.com', //  <----  YOUR Gmail Address
                pass: 'your-app-password' //  <----  YOUR App Password
            }
        });

        // Email message options
        const mailOptions = {
            from: 'your-gmail@gmail.com', //  <----  YOUR Gmail Address
            to: 'your-gmail@gmail.com', //  <----  Where you want the email to go (e.g., your Gmail)
            subject: 'Talent Sunday Registration',
            text: `
                New Talent Sunday Registration:
                Full Name: ${fullName}
                Email: ${email}
                ${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent!');
        res.send('Email sent successfully!'); // Send a response back to the client

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email'); // Send an error response
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});