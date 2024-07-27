const sendOtpEmail = require('../Password Reset/mailer'); 

exports.sendOtp = async (req, res) => {
    console.log("Function called!");
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    // Generate a random OTP (e.g., 6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        await sendOtpEmail(email, otp);
        // Optionally, store OTP in database for verification later
        res.status(200).send('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send('Error sending OTP');
    }
};
