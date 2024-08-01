import React, { useState } from 'react';
import Navbar from './Navbar';
import Manager from '../Images/add.png';
import ListManager from '../Images/list.png';
import { Switch } from 'antd';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import fetchWithToken from '../services/api';


function AddManager() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const registrationURL = `${serverUrl}/managers/manager-register`;
  const UPLOADCSVURL = `${serverUrl}/users/upload-manager-csv`;


  const [manager, setManager] = useState({
    managerId: '',
    managerName: '',
    email: '',
    password: '',
    designation: '',
    section: '',
    appointment: '',
    allProductReport: false,
    demandReceived: false,
    issueProduct: false,
  });

  const [csvFile, setCsvFile] = useState(null);
  const [csvFileName, setCsvFileName] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setManager({
      ...manager,
      [name]: value,
    });
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      toast.error("Please select a CSV file to upload");
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      const response = await fetch(UPLOADCSVURL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("CSV file uploaded successfully");
        setCsvFile(null);
        setCsvFileName("");
      } else {
        const data = await response.json();
        toast.error(data.msg || "Failed to upload CSV file");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("An error occurred while uploading CSV");
    }
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
      const response = await fetchWithToken(registrationURL, {
        method: 'POST',
        body: JSON.stringify(manager),
      });

      if (response.ok) {
        toast.success('Successfully registered');
        setManager({
          managerId: '',
          managerName: '',
          email: '',
          password: '',
          designation: '',
          section: '',
          appointment: '',
          allProductReport: false,
          demandReceived: false,
          issueProduct: false,
        });

      }
      else {
        toast.error('Invalid details');
       }

     
    } catch (error) {
      console.error('Error while registration:', error);
      toast.error('An error occurred');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      setCsvFileName(file.name);
    }
  };

  return (
    <div className='h-auto'>
      <Navbar />
      <div className='m-4 md:m-12 justify-between'>
        <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
          <div className='flex gap-10'>
            <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
              <div className='w-10 block'>
                <img src={Manager} alt='Add Manager' />
              </div>
              <div>
                <p>Add <br /> Manager</p>
              </div>
            </div>
            <Link to='/home/all-managers'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                <div className='w-10 block'>
                  <img src={ListManager} alt='List of Managers' />
                </div>
                <div>
                  <p>All <br /> Managers</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='bg-sky-300 p-12'>
            <div className='flex flex-col md:flex-row justify-center items-center text-black font-bold'>
              <div className='flex gap-5 justify-center items-center'>
                <div>All Product Reports</div>
                <Switch
                  name='allProductReport'
                  onChange={(checked) => handleSwitch(checked, 'allProductReport')}
                  checked={manager.allProductReport}
                />
              </div>
              <div className='flex gap-5 justify-center items-center p-5 md:p-10'>
                <div>Demand Reports</div>
                <Switch
                  name='demandReceived'
                  onChange={(checked) => handleSwitch(checked, 'demandReceived')}
                  checked={manager.demandReceived}
                />
              </div>
              <div className='flex gap-5 justify-center items-center'>
                <div>Issue Product</div>
                <Switch
                  name='issueProduct'
                  onChange={(checked) => handleSwitch(checked, 'issueProduct')}
                  checked={manager.issueProduct}
                />
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 justify-center items-center'>
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
                type='email'
                name='email'
                onChange={handleInput}
                value={manager.email}
                placeholder='Manager Email'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />

              <input
                type='password'
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
            <div className='flex flex-col md:flex-row justify-around items-center mt-8 md:gap-10'>
              <button type='submit' className='bg-sky-800 text-white w-full md:w-1/3 p-2 md:p-3 rounded-xl mb-4 md:mb-0'>
                Submit
              </button>
              <input
                type='file'
                accept='.csv'
                onChange={handleFileChange}
                className='hidden'
                id='csvFileInput'
              />
              <label htmlFor='csvFileInput' className='bg-sky-800 text-white w-full md:w-1/3 p-2 md:p-3 rounded-xl mb-4 md:mb-0 cursor-pointer text-center'>
                Choose CSV File
              </label>
              {csvFileName && (
                <div className='text-center text-black'>
                  <p>Selected file: {csvFileName}</p>
                </div>
              )}
              <button type='button' className='bg-sky-800 text-white w-full md:w-1/3 p-2 md:p-3 rounded-xl mb-4 md:mb-0' onClick={handleCSVUpload}>
                Submit CSV File
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddManager;
