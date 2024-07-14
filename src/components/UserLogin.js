import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Bg from '../Images/bg1.jpg'
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const LOGIN_URL = ` ${serverUrl}/users/user-login`

function UserLogin() {

  const [user, setUser] = useState({
    userId: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
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
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received:", data)

        // userId, userName, designation, section, appointment

        const userId = data.user.userId
        const userName = data.user.userName;
        const designation = data.user.designation;
        const section = data.user.section;
        const appointment = data.user.appointment;

        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        localStorage.setItem('designation', designation);
        localStorage.setItem('section', section);
        localStorage.setItem('appointment', appointment);



        console.log("userId:", userId);
        console.log("userName:", userName);
        console.log("Designation:", designation);
        console.log("section:", section);
        console.log("appointment:", appointment);

        toast.success("Login successful");
        setUser({ userId: "", password: "" });

        navigate('/User-Home');
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className='relative h-screen bg-sky-800'>
      <div className='absolute inset-0   flex items-center justify-center'>

        <div className="w-4/5 md:w-1/4 border  rounded-lg shadow p-5">
        <div className='grid grid-cols-3 md:gap-4 gap-2 justify-center items-center mt-5'>
            <Link to='/login'>
              <div className='bg-sky-200 border md:text-xl font-semibold text-black w-full  rounded-lg text-center p-2'>Admid</div>
            </Link>
            <Link to='/manager-login'>
              <div className='bg-sky-200 border md:text-xl font-semibold text-black w-full rounded-lg text-center p-2'>Manager</div>
            </Link>
            <Link to='/'>
              <div className=' text-xl text-white border font-semibold w-full rounded-lg text-center p-2 '>User</div>
            </Link>
          </div>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

            <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-3xl dark:text-white">
              User Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="userId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User ID</label>
                <input type="text" name="userId" id="userId" onChange={handleInput} className="w-full bg-transparent border-b border-gray-300  px-4 py-2 focus:outline-none text-white" placeholder=" User ID" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" onChange={handleInput} placeholder="••••••••" className="w-full bg-transparent border-b border-gray-300  px-4 py-2 focus:outline-none text-white  mb-6" required />
              </div>
              <div className='mt-20 flex justify-center items-center'>
                <button type="submit" className="w-1/2 flex justify-center items-center hover:bg-gray-500 hover:text-black text-xl font-bold text-white border p-3 rounded-xl">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin