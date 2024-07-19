import React from 'react'
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Manager from '../Images/add.png';
import ListManager from '../Images/list.png'
import { Switch } from 'antd';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import AddUsers from '../Images/add.png'
import List from '../Images/list.png'
import ManagerNavbar from '../components/ManagerNavbar';

function ManagerAddUser() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const registrationURL = `${serverUrl}/users/user-register`;

  const [user, setUser] = useState({
    userId: '',
    userName: '',
    password: '',
    designation: '',
    section: '',
    appointment: '',
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(registrationURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        toast.success('Successfully registered');
        setUser({
          userId: '',
          userName: '',
          password: '',
          designation: '',
          section: '',
          appointment: '',
        });
      } else {
        toast.error('Invalid details');
      }
    } catch (error) {
      console.error('Error while registration:', error);
      toast.error('An error occurred');
    }
  };

  
  return (
    <div>
      <ManagerNavbar/>
      <div className='m-4 md:m-12 border border-black justify-between'>
        <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>

          <div className='flex gap-10'>

            <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
              <div className='w-10 block'>
                <img src={AddUsers} alt='Description' />
              </div>
              <div>
                <p>Add User</p>
              </div>

            </div>
            <Link to='/manager-dashboard/manager-UserList'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                <div className='w-10 block'>
                  <img src={List} alt='Description' />
                </div>
                <div>
                  <p>User List</p>
                </div>

              </div>
            </Link>

          </div>
        </div>
        <section className="bg-sky-300">
          <div className="flex flex-col items-center justify-center sm:p-5  mx-auto">
            <div className="w-full bg-white rounded-md ">
              <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1  justify-center items-center bg-sky-300 pt-10 md:p-12'>
                  <div className='grid grid-cols-1 justify-center items-center'>
                    <input
                      type='text'
                      name='userId'
                      onChange={handleInput}
                      value={user.userId}
                      placeholder='User ID'
                      className='m-3 p-2 outline-none border rounded-xl'
                      required
                    />
                    <input
                      type='text'
                      name='userName'
                      onChange={handleInput}
                      value={user.userName}
                      placeholder='User Name'
                      className='m-3 p-2 outline-none border rounded-xl'
                      required
                    />
                    <input
                      type='text'
                      name='password'
                      onChange={handleInput}
                      value={user.password}
                      placeholder='User Password'
                      className='m-3 p-2 outline-none border rounded-xl'
                      required
                    />
                    <input
                      type='text'
                      name='designation'
                      onChange={handleInput}
                      value={user.designation}
                      placeholder='User Desgination'
                      className='m-3 p-2 outline-none border rounded-xl'
                      required
                    />
                    <input
                      type='text'
                      name='section'
                      onChange={handleInput}
                      value={user.section}
                      placeholder='User Section'
                      className='m-3 p-2 outline-none border rounded-xl'
                      required
                    />
                    <input
                      type='text'
                      name='appointment'
                      onChange={handleInput}
                      value={user.appointment}
                      placeholder='User Appointment'
                      className='m-3 p-2 outline-none border rounded-xl'
                      required
                    />

                  </div>
                  <div className='flex justify-around items-center flex-col md:flex-row'>
                    <button
                      type='submit'
                      className='flex justify-center items-center cursor-pointer bg-sky-900 text-white mx-5 w-1/2 md:w-1/3 p-2 md:p-3 mt-5 md:mt-14 rounded-xl'
                    >
                      Submit
                    </button>

                    <button
                      
                      className='flex justify-center items-center cursor-pointer bg-sky-900 text-white mx5o w-1/2 md:w-1/3 p-2 md:p-3 mt-5 md:mt-14 rounded-xl'
                    >
                      Choose CSV File
                    </button>

                    <button
                      
                      className='flex justify-center items-center cursor-pointer bg-sky-900 text-white mx-5 w-1/2 md:w-1/3 p-2 md:p-3 mt-5 md:mt-14 rounded-xl'
                    >
                      Submit CSV File
                    </button>
                  </div>

                </div>
              </form>

            </div>
          </div>
        </section>

        <div></div>
      </div>
    </div>
  )
}

export default ManagerAddUser