import React, { useState } from 'react';
import Navbar from './Navbar';
import AddCompanyIcon from '../Images/AddCompany1.png';
import ListIcon from '../Images/list.png';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function AddCompany() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const registrationURL = `${serverUrl}/companies/company-register`;
  const uploadCSVURL = `${serverUrl}/companies/upload-company-csv`;

  const navigate = useNavigate();

  const [company, setCompany] = useState({
    companyId: '',
    companyName: '',
    email: '',
    alternativeEmail: '',
    contact_1: '',
    contact_2: '',
    password: ''
  });

  const [csvFile, setCsvFile] = useState(null);
  const [csvFileName, setCsvFileName] = useState("");

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
          companyId: '',
          companyName: '',
          email: '',
          alternativeEmail: '',
          contact_1: '',
          contact_2: '',
          password: ''
        });
      } 
      else if (response.status === 401) {
        toast.error('Invalid credentials');
        navigate('/authorization-failed');
        setTimeout(() => {
          navigate('/home/add-manager'); 
        }, 2000);

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
                    name='companyId'
                    onChange={handleInput}
                    value={company.companyId}
                    placeholder='Company ID'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='text'
                    name='companyName'
                    onChange={handleInput}
                    value={company.companyName}
                    placeholder='Company Name'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='email'
                    name='email'
                    onChange={handleInput}
                    value={company.email}
                    placeholder='Company Email'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='text'
                    name='alternativeEmail'
                    onChange={handleInput}
                    value={company.alternativeEmail}
                    placeholder='Alternative Email'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='password'
                    name='password'
                    onChange={handleInput}
                    value={company.password}
                    placeholder='Password'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='text'
                    name='contact_1'
                    onChange={handleInput}
                    value={company.contact_1}
                    placeholder='Company Contact Number'
                    className='m-2 p-2 outline-none border rounded-xl w-full'
                    required
                  />
                  <input
                    type='text'
                    name='contact_2'
                    onChange={handleInput}
                    value={company.contact_2}
                    placeholder='Alternative Contact Number'
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
                    <input
                      type='file'
                      accept='.csv'
                      onChange={handleFileChange}
                      className='hidden'
                      id='csvFileInput'
                    />
                    <label htmlFor='csvFileInput' className='flex justify-center items-center cursor-pointer bg-sky-800 text-white mx-2 w-full md:w-1/3 p-2 md:p-3 mt-2 md:mt-0 rounded-xl text-center'>
                      Choose CSV File
                    </label>
                    {csvFileName && (
                      <div className='text-center text-black'>
                        <p>Selected file: {csvFileName}</p>
                      </div>
                    )}
                    <button
                      type='button'
                      className='flex justify-center items-center cursor-pointer bg-sky-800 text-white mx-2 w-full md:w-1/3 p-2 md:p-3 mt-2 md:mt-0 rounded-xl'
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

export default AddCompany;
