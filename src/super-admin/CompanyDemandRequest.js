import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import Demand from '../Images/demand1.png';
import { toast } from 'react-toastify';
import fetchWithToken from '../services/api';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getAllCompanyDemand`;
const downloadCSVURL = `${serverUrl}/users/download-companyDemand-csv`; // CSV download URL

function CompanyDemandRequest() {
  const [demandData, setDemandData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchDemandData = async () => {
      try {
        const response = await fetchWithToken(REQ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDemandData(data.demands);
          toast.success("Fetched Successfully");
        } else {
          toast.error("Failed to fetch");
        }
      } catch (error) {
        console.error('Error fetching demand data:', error);
      }
    };

    fetchDemandData();
  }, []);

  useEffect(() => {
    console.log('Updated demandData:', demandData);
  }, [demandData]);

  const getStatusClassName = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-blue-500 text-lg font-bold';
      case 'rejected':
        return 'text-red-500 text-lg font-bold';
      case 'pending':
        return 'text-yellow-500 text-lg font-bold';
      case 'completed':
        return 'text-green-500 text-lg font-bold';
      default:
        return '';
    }
  };

  // Function to handle CSV download
  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(downloadCSVURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // This is typically optional for downloads
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'company_Demands.csv'; // Ensure filename is correct
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success('CSV file downloaded successfully');
      } else {
        console.error('Failed to download CSV:', response.statusText);
        toast.error('Failed to download CSV');
      }
    } catch (error) {
      console.error('Error while downloading CSV:', error);
      toast.error('An error occurred while downloading CSV');
    }
  };

  // Pagination logic
  const indexOfLastDemand = currentPage * itemsPerPage;
  const indexOfFirstDemand = indexOfLastDemand - itemsPerPage;
  const currentDemands = demandData.slice(indexOfFirstDemand, indexOfLastDemand);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(demandData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Navbar />
      <div className='m-4 md:m-12 justify-between'>
        <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
          <div className='flex gap-10'>
            <Link to='/home/demand-request'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer '>
                <div className='w-14 block'>
                  <img src={Demand} alt='Description' />
                </div>
                <div className='text-xl font-semibold'>
                  User Demand
                </div>
              </div>
            </Link>
            <Link to='/home/company-demand-request'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
                <div className='w-14 block'>
                  <img src={Demand} alt='Description' />
                </div>
                <div className='text-xl font-semibold'>
                  Company Demand
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className='bg-sky-300'>
          <form className="max-w-md mx-auto md:pt-20 p-6">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm rounded-lg bg-sky-800 placeholder-gray-300 outline-none text-white" placeholder="Search Using Name / ID" required />
            </div>
          </form>
          <div className="p-2 md:p-10">
            <button className="bg-sky-800 text-white p-2 rounded-md">Refresh</button>
            &nbsp;&nbsp;&nbsp;
            <button onClick={handleDownloadCSV} className="bg-sky-800 text-white p-2 rounded-md">Download CSV</button>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-sky-100 border border-black">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border border-black text-center">Demand ID</th>
                    <th className="py-2 px-4 border border-black text-center">Company ID</th>
                    <th className="py-2 px-4 border border-black text-center">Product Type</th>
                    <th className="py-2 px-4 border border-black text-center">Product Name</th>
                    <th className="py-2 px-4 border border-black text-center">Model</th>
                    <th className="py-2 px-4 border border-black text-center">Brand</th>
                    <th className="py-2 px-4 border border-black text-center">Quantity</th>
                    <th className="py-2 px-4 border border-black text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDemands.length > 0 ? (
                    currentDemands.map((demand) => (
                      <tr key={demand.demandId}>
                        <td className="py-2 px-4 border border-black text-center">{demand.demandId}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.companyId}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productType}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productName}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productModel}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productBrand}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productQuantity}</td>
                        <td className={`py-2 px-4 border border-black text-center ${getStatusClassName(demand.status)}`}>{demand.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-2 px-4 border border-black text-center">
                        No demand requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => handleClick(number)}
                  className={`mx-1 px-3 py-1 rounded-md ${currentPage === number ? 'bg-sky-800 text-white' : 'bg-gray-300 text-black'}`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDemandRequest;
