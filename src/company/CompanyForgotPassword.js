import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/companies/sendOTP`;
const VERIFY_URL = `${serverUrl}/companies/verifyOTP`;
const UPDATE_URL = `${serverUrl}/companies/updatePassword`;

function CompanyForgotPassword() {
    const [otpSectionVisible, setOtpSectionVisible] = useState(false);
    const [passwordSectionVisible, setPasswordSectionVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleGetOtpClick = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(REQ_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    role: 'Company',
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("OTP Sent Successfully");
                setOtpSectionVisible(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error("Error sending OTP");
        }
    };

    const handleVerifyOtpClick = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(VERIFY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: Number(otp) }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("OTP Verified Successfully");
                setPasswordSectionVisible(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error("Error verifying OTP");
        }
    };

    const handleUpdatePasswordClick = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            const response = await fetch(UPDATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password: newPassword, role: 'Company', }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Password Changed Successfully");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error("Error updating password");
        }
    };

    return (
        <div className='relative h-screen bg-sky-800 flex items-center justify-center'>
            <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-6 md:p-8">
                <h1 className="text-2xl font-bold text-center text-gray-100 mb-6">Company Forgot Password</h1>
                {!otpSectionVisible ? (
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Enter Company Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Enter Company Email"
                                required
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={handleGetOtpClick}
                                className="w-full bg-sky-500 text-gray-900 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold py-2 px-4 rounded-md shadow"
                            >
                                Get OTP
                            </button>
                        </div>
                    </form>
                ) : !passwordSectionVisible ? (
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                name="otp"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="6-digit OTP"
                                required
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={handleVerifyOtpClick}
                                className="w-full bg-sky-500 text-gray-900 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold py-2 px-4 rounded-md shadow"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Enter New Password"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Confirm New Password"
                                required
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={handleUpdatePasswordClick}
                                className="w-full bg-sky-500 text-gray-900 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold py-2 px-4 rounded-md shadow"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                )}
                <div className="text-center mt-6 text-gray-400">
                    After changing the password, please &nbsp;
                    <Link to='/company-login'>
                        <span className="text-sky-300 hover:text-sky-400 font-semibold">
                            Login
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CompanyForgotPassword;
