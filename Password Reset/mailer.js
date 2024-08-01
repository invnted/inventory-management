const SibApiV3Sdk = require('sib-api-v3-sdk');

// Replace with your Brevo API key
const apiKey = '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';

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
