import React from 'react';
import { Link } from 'react-router-dom';
import Admin from '../Images/admin.png';
import Manager from '../Images/manager.png';
import User from '../Images/user.png';

function LoginOption() {
    return (
        <div className="relative h-screen bg-sky-800">
            <div className="absolute inset-0 bg-sky-800">
                <h1 className="text-2xl md:text-5xl font-bold text-white m-10 text-center md:mt-36 flex justify-center items-center">Please Select Your Role</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-6 md:m-40">
                    <Link to="/login">
                        <div className="border-2 border-white rounded-xl p-6 md:p-10 text-2xl md:text-4xl font-semibold text-white cursor-pointer flex flex-col justify-center items-center">
                            <div className="w-12 md:w-20"><img src={Admin} alt="Admin" /></div>
                            <div>Super Admin</div>
                        </div>
                    </Link>
                    <Link to="/manager-login">
                        <div className="border-2 border-white rounded-xl p-6 md:p-10 text-2xl md:text-4xl font-semibold text-white cursor-pointer flex flex-col justify-center items-center">
                            <div className="w-12 md:w-20"><img src={Manager} alt="Manager" /></div>
                            <div>Manager</div>
                        </div>
                    </Link>
                    <Link to="/user-login">
                        <div className="border-2 border-white rounded-xl p-6 md:p-10 text-2xl md:text-4xl font-semibold text-white cursor-pointer flex flex-col justify-center items-center">
                            <div className="w-12 md:w-20"><img src={User} alt="User" /></div>
                            <div>User</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginOption;
