import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import RadioButton from './RadioButton';
import Bg from '../Images/bg1.jpg'
import { useEffect, useRef } from 'react';



const serverUrl = process.env.REACT_APP_SERVER_URL;
const LOGIN_URL = ` ${serverUrl}/admins/admin-login`



function AdminLogin() {
  const [admin, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...admin,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(admin),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received:", data)

        const adminName = data.admin.adminName;
        const email = data.admin.email;
        const department = data.admin.department;
        const profileId = data.admin.profileId;
        const role = data.admin.role;

        localStorage.setItem('adminName', adminName);
        localStorage.setItem('email', email);
        localStorage.setItem('department', department);
        localStorage.setItem('profileId', profileId);
        localStorage.setItem('role', role);


        console.log("adminName:", adminName);
        console.log("Email:", email);
        console.log("Department:", department);
        console.log("Profile ID:", profileId);
        console.log("Role:", role);

        toast.success("Login successful");
        setUser({ email: "", password: "" });

        navigate('/home', { state: { adminName, email, department, profileId, role } });
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Adjust the playback rate here (0.5 means half speed)
    }
  }, []);
  return (
    <div className='relative h-screen bg-sky-800'>
      <div className='absolute inset-0  flex items-center justify-center'>
        <div className="w-4/5 md:w-1/4 border  rounded-lg shadow p-5">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-3xl dark:text-white">
              Admin Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" className="w-full bg-transparent border-b border-gray-300  px-4 py-2 focus:outline-none text-white" placeholder="name@company.com" onChange={handleInput} required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" onChange={handleInput} name="password" id="password" placeholder="••••••••" className="w-full bg-transparent border-b border-gray-300  px-4 py-2 focus:outline-none text-white mb-6" required />
              </div>
              <div className='mt-20 flex justify-center items-center'>
                <button type="submit" className="w-1/2 flex justify-center items-center hover:bg-gray-500 hover:text-black text-xl font-bold text-white border p-3 rounded-xl">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;