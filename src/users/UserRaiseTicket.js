import React, { useState, useEffect } from 'react';
import UserNavbar from './UserNavbar';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import fetchWithToken from '../services/api';

function UserRaiseTicket() {
  const [productId, setProductId] = useState('');
  const [issueType, setIssueType] = useState('Repair');
  const [message, setMessage] = useState('');
  const [issuedBy, setIssuedBy] = useState('');

  // Generate a random ticket ID
  function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  useEffect(() => {
    const savedProductId = localStorage.getItem('productId');
    const savedIssuedBy = localStorage.getItem('userId'); // Assuming 'userId' is used for issuedBy
    if (savedProductId) {
      setProductId(savedProductId);
    }
    if (savedIssuedBy) {
      setIssuedBy(savedIssuedBy);
    }
  }, []);

  const handleIssueTypeChange = (e) => {
    setIssueType(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketId = generateRandomString();
    const ticketData = {
      ticketId,
      productId,
      issueType,
      message,
      issuedBy,
    };

    try {
      const response = await fetchWithToken(`${process.env.REACT_APP_SERVER_URL}/products/raiseTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        console.log('Ticket raised successfully');
        toast.success("Ticket raised successfully");
        
      } else {
        console.error('Failed to raise ticket');
        toast.error("Failed to raise ticket");
      }
    } catch (error) {
      toast.error("Error occured while raising ticket");
      console.error('Error raising ticket:', error);
    }
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
            <div className='bg-sky-300 w-full md:w-1/2 text-black'>
              <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                  <label htmlFor='productId' className='block text-xl font-medium text-gray-700'>
                    Product ID
                  </label>
                  <input
                    type='text'
                    id='productId'
                    className='mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100'
                    value={productId}
                    readOnly
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='issueType' className='block text-xl font-medium text-gray-700'>
                    Issue Type
                  </label>
                  <select
                    id='issueType'
                    className='mt-1 p-2 w-full border border-gray-300 rounded-md'
                    value={issueType}
                    onChange={handleIssueTypeChange}
                    required
                  >
                    <option value='Repair'>Repair</option>
                    <option value='Replace'>Replace</option>
                  </select>
                </div>
                <div className='mb-4'>
                  <label htmlFor='message' className='block text-xl font-medium text-gray-700'>
                    Issue Description
                  </label>
                  <textarea
                    id='message'
                    className='mt-1 p-2 w-full border border-gray-300 rounded-md'
                    value={message}
                    onChange={handleMessageChange}
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
