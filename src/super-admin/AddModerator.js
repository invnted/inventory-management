import React, { useState } from 'react';
import Navbar from './Navbar';
import AddUsers from '../Images/add-user.png';
import List from '../Images/list.png';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function AddModerator() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const registrationURL = `${serverUrl}/moderators/register`;
  const uploadCSVURL = `${serverUrl}/moderators/upload-moderator-csv`;
  


  const [moderator, setModerator] = useState({
    moderatorId: '',
    moderatorName: '',
    password: '',
    designation: '',
    section: '',
    appointment: '',
  });

  const [csvFile, setCsvFile] = useState(null);
  const [csvFileName, setCsvFileName] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setModerator({
      ...moderator,
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
        body: JSON.stringify(moderator),
      });

      if (response.ok) {
        toast.success('Successfully registered');
        setModerator({
          moderatorId: '',
          moderatorName: '',
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      setCsvFileName(file.name);
    }
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
      const response = await fetch(uploadCSVURL, {
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

  

  return (
    <div>
      <Navbar />
      <div className='m-4 md:m-12'>
        <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
          <div className='flex gap-10'>
            <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
              <div className='w-10 block'>
                <img src={AddUsers} alt='Description' />
              </div>
              <div>
                <p>Add Moderator</p>
              </div>
            </div>
            <Link to='/moderator-home/all-moderator'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                <div className='w-10 block'>
                  <img src={List} alt='Description' />
                </div>
                <div>
                  <p>Moderator List</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <section className='bg-sky-300'>
          <div className='flex flex-col items-center justify-center p-5 mx-auto'>
            <div className='w-full bg-sky-300 rounded-md'>
              <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 gap-4 justify-center items-center bg-sky-300 pt-10 md:p-12'>
                  <input
                    type='text'
                    name='moderatorId'
                    onChange={handleInput}
                    value={moderator.moderatorId}
                    placeholder='Moderator ID'
                    className='m-3 p-2 outline-none border rounded-xl'
                    required
                  />
                  <input
                    type='text'
                    name='moderatorName'
                    onChange={handleInput}
                    value={moderator.moderatorName}
                    placeholder='Moderator Name'
                    className='m-3 p-2 outline-none border rounded-xl'
                    required
                  />
                  <input
                    type='password'
                    name='password'
                    onChange={handleInput}
                    value={moderator.password}
                    placeholder='Moderator Password'
                    className='m-3 p-2 outline-none border rounded-xl'
                    required
                  />
                  <input
                    type='text'
                    name='designation'
                    onChange={handleInput}
                    value={moderator.designation}
                    placeholder='Moderator Designation'
                    className='m-3 p-2 outline-none border rounded-xl'
                    required
                  />
                  <input
                    type='text'
                    name='section'
                    onChange={handleInput}
                    value={moderator.section}
                    placeholder='Moderator Section'
                    className='m-3 p-2 outline-none border rounded-xl'
                    required
                  />
                  <input
                    type='text'
                    name='appointment'
                    onChange={handleInput}
                    value={moderator.appointment}
                    placeholder='Moderator Appointment'
                    className='m-3 p-2 outline-none border rounded-xl'
                    required
                  />
                  <div className='flex flex-col md:flex-row justify-around items-center md:gap-10'>
                    <button
                      type='submit'
                      className='flex justify-center items-center cursor-pointer bg-sky-800 text-white w-full md:w-1/3 p-2 mt-5 rounded-xl'
                    >
                      Submit
                    </button>
                    <input
                      type='file'
                      accept='.csv'
                      onChange={handleFileChange}
                      className='hidden'
                      id='csvFileInput'
                    />
                    <label htmlFor='csvFileInput' className='flex justify-center items-center cursor-pointer bg-sky-800 text-white w-full md:w-1/3 p-2 mt-5 rounded-xl text-center'>
                      Choose CSV File
                    </label>
                    {csvFileName && (
                      <div className='text-center text-black'>
                        <p>Selected file: {csvFileName}</p>
                      </div>
                    )}
                    <button
                      type='button'
                      className='flex justify-center items-center cursor-pointer bg-sky-800 text-white w-full md:w-1/3 p-2 mt-5 rounded-xl'
                      onClick={handleCSVUpload}
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

export default AddModerator;