import React, { useState } from 'react';
import UserNavbar from './UserNavbar'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Demand from '../Images/demand1.png'
import fetchWithToken from '../services/api';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = ` ${serverUrl}/products/makeDemand`

function RaiseDemand() {

  function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }



  const userId = localStorage.getItem('userId') || 'N/A';
  const designation = localStorage.getItem('designation') || 'N/A';

  const [demand, setDemand] = useState({
    demandId: generateRandomString(),
    userId: userId,
    designation: designation,
    productType: "",
    productName: "",
    productModel: "",
    productBrand: "",
    additionalDetail: "",
    productQuantity: "",
  });
  ;

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setDemand({
      ...demand,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithToken(REQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(demand),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received:", data);
        toast.success("Demand successfully Raised");


        setDemand({
          demandId: generateRandomString(),
          userId: userId,
          designation: designation,
          productType: "",
          productName: "",
          productModel: "",
          productBrand: "",
          additionalDetail: "",
          productQuantity: "",
        });
      } else {
        toast.error("Invalid details");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className='bg-white h-screen'>
      <UserNavbar />


      <form onSubmit={handleSubmit}>

        <div className='grid grid-cols-1  justify-center items-center  '>
          <div className='grid grid-cols-1 justify-center items-center m-4 md:m-10 bg-sky-300 '>
            <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
              <div className='flex gap-10'>
                <Link to='/user-home/raise-demand'>
                  <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
                    <div className='w-14 block'>
                      <img src={Demand} alt='Description' />
                    </div>
                    <div className='text-xl font-semibold'>
                      Raise Demand
                    </div>
                  </div>
                </Link>
                <Link to='/user-home/raise-demand-report'>
                  <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                    <div className='w-14 block'>
                      <img src={Demand} alt='Description' />
                    </div>
                    <div className='text-xl font-semibold'>
                      Demand Report
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className='grid m-8'>
              <input
                onChange={handleInput}
                type='text'
                name='productType'
                placeholder='Product Type'
                className='mt-3 md:m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='text'
                name='productName'
                placeholder='Product Name'
                className='mt-3 md:m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='text'
                name='productModel'
                placeholder='Product Model'
                className='mt-3 md:m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='text'
                name='productBrand'
                placeholder='Product Brand'
                className='mt-3 md:m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='text'
                name='additionalDetail'
                placeholder='Additional Details'
                className='mt-3 md:m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='number'
                name='productQuantity'
                placeholder='Product Quantity'
                className='mt-3 md:m-3 p-2 outline-none border rounded-xl'
                required
              />
            </div>
            <button
              type='submit'
              className='flex justify-center items-center cursor-pointer bg-sky-800 text-white mx-auto w-1/2 md:w-1/3 p-3 mb-10 rounded-xl'
            >
              Submit
            </button>

          </div>


        </div>
      </form>

    </div>
  )
}

export default RaiseDemand