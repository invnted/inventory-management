import React, { useState } from 'react';
import UserNavbar from '../components/UserNavbar'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = ` ${serverUrl}/products/makeDemand`

function CompanyRaiseDemand() {

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
      const response = await fetch(REQ_URL, {
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
    <div className='bg-sky-300 h-screen'>
      <CompanyNavbar />


      <form onSubmit={handleSubmit}>

        <div className='grid grid-cols-1  justify-center items-center bg-sky-300 '>
          <div className='grid grid-cols-1 justify-center items-center m-10 md:mx-20 '>
            <div className='flex justify-center items-center h-auto pb-5 gap-6 text-center text-blue-700  font-bold text-5xl'>
              <Link to='/company-home/raise-demand'>
                <div className='border-4 p-2 border-sky-800 rounded-xl'>Raise Demand</div>
              </Link>
              <Link to='/company-home/raise-demand-report'>
                <div>Raise Demand Report</div>
              </Link>
            </div>
            <div className='grid '>
              <input
                onChange={handleInput}
                type='text'
                name='productType'
                placeholder='Product Type'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='text'
                name='productName'
                placeholder='Product Name'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='text'
                name='productModel'
                placeholder='Product Model'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='text'
                name='productBrand'
                placeholder='Product Brand'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='text'
                name='additionalDetail'
                placeholder='Additional Details'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
              <input
                onChange={handleInput}
                type='number'
                name='productQuantity'
                placeholder='Product Quantity'
                className='m-3 p-2 outline-none border rounded-xl'
                required
              />
            </div>
            <button
              type='submit'
              className='flex justify-center items-center cursor-pointer bg-sky-800 text-white mx-auto w-1/2 md:w-1/3 p-3 m-10 rounded-xl'
            >
              Submit
            </button>

          </div>


        </div>
      </form>

    </div>
  )
}

export default CompanyRaiseDemand