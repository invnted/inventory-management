const Admin = require('../models/Admin'); 
const Manager = require('../models/Manager'); 
const User = require('../models/User'); 
const Moderator = require('../models/Moderator'); 
const Company = require('../models/Company'); 
const sendOtpEmail = require('../Password Reset/mailer');
const OTP = require('../models/OTP'); 
const bcrypt = require('bcryptjs');


exports.sendOtp = async (req, res) => {
    console.log("Function called!");
    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ success: false, message: 'Email and role are required' });
    }

    const roleModelMap = {
        admin: Admin,
        manager: Manager,
        user: User,
        moderator: Moderator,
        company: Company
    };

    const Model = roleModelMap[role.toLowerCase()];

    if (!Model) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    try {
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not found in the specified role' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store OTP and expiration time
        await OTP.updateOne({ email }, { otp, expirationTime }, { upsert: true });

        // Send OTP email
        await sendOtpEmail(email, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error processing OTP request:', error);
        res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
};


exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    console.log(req.body);


    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        const otpRecord = await OTP.findOne({ email });

        console.log("OTP FOR",email,"is",otpRecord.otp);

        if (!otpRecord) {
            return res.status(404).json({ success: false, message: 'OTP record not found' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (Date.now() > otpRecord.expirationTime) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        // OTP is valid and not expired
        await OTP.deleteOne({ email }); // Optionally delete OTP after successful verification

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Error verifying OTP' });
    }
};


exports.updatePassword = async (req, res) => {
    const { email, password, role } = req.body;
    console.log(req.body);

    if (!email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Email, password, and role are required' });
    }

    const roleModelMap = {
        admin: Admin,
        manager: Manager,
        user: User,
        moderator: Moderator,
        company: Company
    };

    const Model = roleModelMap[role.toLowerCase()];
    if (!Model) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    try {
        
        convertedPassword = await bcrypt.hash(password, 10);
        
        // Update the password in the specified collection
        await Model.updateOne({ email }, { password: convertedPassword });
        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Error updating password' });
    }
};