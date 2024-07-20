import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AddCompanyIcon from '../Images/AddCompany1.png';
import ListIcon from '../Images/list.png';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function AddCompany() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const registrationURL = `${serverUrl}/companies/company-register`;

  const [company, setCompany] = useState({
    userId: '',
    userName: '',
    password: '',
    designation: '',
    section: '',
    appointment: '',
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCompany({
      ...company,
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
        body: JSON.stringify(company),
      });

      if (response.ok) {
        toast.success('Successfully registered');
        setCompany({
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
      <Navbar />
      <div className='m-4 md:m-12 bg-sky-300'>
        <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
          <div className='flex gap-10'>
            <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
              <div className='w-10 block'>
                <img src={AddCompanyIcon} alt='Add Company' />
              </div>
              <div>
                <p>Add Company</p>
              </div>
            </div>
            <Link to='/home/company-list'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                <div className='w-10 block'>
                  <img src={ListIcon} alt='Company List' />
                </div>
                <div>
                  <p>Company List</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <section className='bg-sky-300 mt-4'>
          <div className='flex flex-col items-center justify-center sm:p-5 mx-auto'>
            <div className='w-full bg-sky-300 rounded-md p-5'>
              <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 gap-4 justify-center items-center bg-sky-300 p-5 md:p-12 rounded-md'>
                  <input
                    type='text'
                    name='userId'
                    onChange={handleInput}
                    value={company.userId}
                    placeholder='User ID'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='text'
                    name='userName'
                    onChange={handleInput}
                    value={company.userName}
                    placeholder='User Name'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='password'
                    name='password'
                    onChange={handleInput}
                    value={company.password}
                    placeholder='User Password'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='text'
                    name='designation'
                    onChange={handleInput}
                    value={company.designation}
                    placeholder='User Designation'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='text'
                    name='section'
                    onChange={handleInput}
                    value={company.section}
                    placeholder='User Section'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='text'
                    name='appointment'
                    onChange={handleInput}
                    value={company.appointment}
                    placeholder='User Appointment'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <div className='flex flex-col md:flex-row justify-around items-center mt-4 md:gap-10'>
                    <button
                      type='submit'
                      className='flex justify-center items-center cursor-pointer bg-sky-800 text-white mx-2 w-full md:w-1/3 p-2 md:p-3 rounded-xl'
                    >
                      Submit
                    </button>
                    <button
                      type='button'
                      className='flex justify-center items-center cursor-pointer bg-sky-800 text-white mx-2 w-full md:w-1/3 p-2 md:p-3 mt-2 md:mt-0 rounded-xl'
                    >
                      Choose CSV File
                    </button>
                    <button
                      type='button'
                      className='flex justify-center items-center cursor-pointer bg-sky-800 text-white mx-2 w-full md:w-1/3 p-2 md:p-3 mt-2 md:mt-0 rounded-xl'
                    >
                      Submit CSV File
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddCompany;
