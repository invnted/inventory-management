import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Manager from '../Images/add.png';
import ListManager from '../Images/list.png'
import { Switch } from 'antd';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function AddManager() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const registrationURL = `${serverUrl}/managers/manager-register`;

  const [manager, setManager] = useState({
    managerId: '',
    managerName: '',
    password: '',
    designation: '',
    section: '',
    appointment: '',
    allProductReport: false,
    demandReceived: false,
    issueProduct: false,
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setManager({
      ...manager,
      [name]: value,
    });
  };

  const handleSwitch = (checked, name) => {
    setManager((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(registrationURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manager),
      });

      if (response.ok) {
        toast.success('Successfully registered');
        setManager({
          managerId: '',
          managerName: '',
          password: '',
          designation: '',
          section: '',
          appointment: '',
          allProductReport: false,
          demandReceived: false,
          issueProduct: false,
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
    <div className='h-auto'>
      <Navbar />
      <div className='m-4 md:m-12 border border-black justify-between'>
        <div className='text-center bg-gray-800 text-black h-24 flex items-center justify-center'>
          <div className='flex gap-10'>
            <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
              <div className='w-10 block'>
                <img src={Manager} alt='Description' />
              </div>
              <div>
                <p>Add <br /> Manager</p>
              </div>
            </div>
            <Link to='/home/all-managers'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex  flex-col justify-center items-center cursor-pointer '>
                <div className='w-10 block'>
                  <img src={ListManager} alt='Description' />
                </div>
                <div>
                  <p>All <br /> managers</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 justify-center items-center bg-gray-500 p-12'>
            <div className='grid grid-cols-1 justify-center items-center'>
              <input
                type='text'
                name='managerId'
                onChange={handleInput}
                value={manager.managerId}
                placeholder='Manager ID'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                type='text'
                name='managerName'
                onChange={handleInput}
                value={manager.managerName}
                placeholder='Manager Name'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                type='text'
                name='password'
                onChange={handleInput}
                value={manager.password}
                placeholder='Manager Password'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                type='text'
                name='designation'
                onChange={handleInput}
                value={manager.designation}
                placeholder='Manager Designation'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                type='text'
                name='section'
                onChange={handleInput}
                value={manager.section}
                placeholder='Manager Section'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                type='text'
                name='appointment'
                onChange={handleInput}
                value={manager.appointment}
                placeholder='Manager Appointment'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />

            </div>
            <div className='flex flex-col justify-center items-center text-gray-200 font-bold'>
              <div className='flex gap-5 justify-center items-center'>
                <div>All Product Reports</div>
                <div>
                  <Switch
                    name='allProductReport'
                    onChange={(checked) => handleSwitch(checked, 'allProductReport')}
                    checked={manager.allProductReport}
                  />
                </div>
              </div>

              <div className='flex gap-5 justify-center items-center p-5 md:p-10'>
                <div>Demand Reports</div>
                <div>
                  <Switch
                    name='demandReceived'
                    onChange={(checked) => handleSwitch(checked, 'demandReceived')}
                    checked={manager.demandReceived}
                  />
                </div>
              </div>

              <div className='flex gap-5 justify-center items-center'>
                <div>Issue Product</div>
                <div>
                  <Switch
                    name='issueProduct'
                    onChange={(checked) => handleSwitch(checked, 'issueProduct')}
                    checked={manager.issueProduct}
                  />
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='flex justify-center items-center cursor-pointer bg-gray-800 text-white mx-auto w-1/2 md:w-1/3 p-2 md:p-3 m-5 rounded-xl'
            >
              Submit
            </button>
          </div>
        </form>
        <div></div>
      </div>
    </div>
  );
}

export default AddManager;