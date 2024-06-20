import React from 'react'
import { Link } from 'react-router-dom'
import Home from '../super-admin/Home'
import { useLocation } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';

function Popup() {
  const location = useLocation();
  const { username, email, department, profileId, role } = location.state || {};
  const LogOut = () => {
    window.localStorage.clear();
    window.location.href = "/";
  }
  return (
    <div><div className=''>
      <Home />
      <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
        <div className='mt-10 flex flex-col gap-5 p-4 text-white bg-blue-500 border rounded-xl'>
          <Link to='/home' className='place-self-end'> <X size={30} /> </Link>
          <div className=''>
            <h2 className='text-center p-4 bg-green-500 text-black rounded-xl'>User Info</h2>
            <div className='p-4 m-5'>
              <h1>Username: {username}</h1>
              <h1>Email: {email}</h1>
              <h1>Department: {department}</h1>
              <h1>Profile ID: {profileId}</h1>
              <h1>Role: {role}</h1>

            </div>
          </div>
          <button onClick={LogOut} className='bg-red-300' >
            Log Out
          </button>
        </div>
      </div>
    </div></div>
  )
}

export default Popup

