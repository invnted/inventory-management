const SibApiV3Sdk = require('sib-api-v3-sdk');

// Replace with your Brevo API key
const apiKey = process.env.BREVO_API;

// Configure the API key
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;

const sendOtpEmail = async (recipientEmail, otp) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Set up email details
    sendSmtpEmail.subject = 'Your OTP Code';
    sendSmtpEmail.htmlContent = `<p>Your OTP code is: <strong>${otp}</strong></p>`;
    sendSmtpEmail.sender = { email: 'ayushkothari610@gmail.com', name: 'Ayush Kothari' };
    sendSmtpEmail.to = [{ email: recipientEmail }];

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendOtpEmail;
