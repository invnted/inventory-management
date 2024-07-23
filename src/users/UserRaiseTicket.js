import React, { useState } from 'react';
import UserNavbar from './UserNavbar';

function UserRaiseTicket() {
  const [productId, setProductId] = useState('');
  const [requestType, setRequestType] = useState('Repair');
  const [issueDescription, setIssueDescription] = useState('');

  const handleProductIdChange = (e) => {
    setProductId(e.target.value);
  };

  const handleRequestTypeChange = (e) => {
    setRequestType(e.target.value);
  };

  const handleIssueDescriptionChange = (e) => {
    setIssueDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      productId,
      requestType,
      issueDescription,
    });
  };

  return (
    <div className='bg-white min-h-screen'>
      <UserNavbar />
      <div className='container mx-auto p-4 md:p-10'>
        <div className='bg-sky-300'>
          <div className='flex justify-center items-center bg-sky-800 p-8 text-4xl font-semibold text-white'>
            Raise Ticket
          </div>
          <div className='bg-sky-300 text-white p-2 md:p-10 flex justify-center items-center'>
            <div className='bg-sky-300  w-full md:w-1/2 text-black'>
              <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                  <label htmlFor='productId' className='block text-xl font-medium text-gray-700'>
                    Product ID
                  </label>
                  <input
                    type='text'
                    id='productId'
                    className='mt-1 p-2 w-full border border-gray-300 rounded-md bg-white'
                    value={productId}
                    onChange={handleProductIdChange}
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='requestType' className='block text-xl font-medium text-gray-700 '>
                    Issue Type
                  </label>
                  <select
                    id='requestType'
                    className='mt-1 p-2 w-full border border-gray-300 rounded-md'
                    value={requestType}
                    onChange={handleRequestTypeChange}
                    required
                  >
                    <option value='Repair'>Repair</option>
                    <option value='Replace'>Replace</option>
                  </select>
                </div>
                <div className='mb-4'>
                  <label htmlFor='issueDescription' className='block text-xl font-medium text-gray-700'>
                    Issue Description
                  </label>
                  <textarea
                    id='issueDescription'
                    className='mt-1 p-2 w-full border border-gray-300 rounded-md'
                    value={issueDescription}
                    onChange={handleIssueDescriptionChange}
                    rows='4'
                    required
                  />
                </div>
                <button
                  type='submit'
                  className='bg-sky-700 text-white py-3 px-4 rounded-md shadow-md hover:bg-sky-800 transition duration-300 w-full text-xl font-semibold'
                >
                  Raise
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRaiseTicket;
