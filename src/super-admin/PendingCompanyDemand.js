import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import fetchWithToken from '../services/api';
import { toast } from 'react-toastify';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getCompanyPendingDemand`;

function PendingCompanyDemand() {
  const [demandData, setDemandData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemandData = async () => {
      try {
        const response = await fetchWithToken(REQ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched demand data:', data); // Debugging: log fetched data
        if (data.success) {
          toast.success("Fetched Successfully");
          setDemandData(data.demands);
        }
      } catch (error) {
        console.error('Error fetching demand data:', error);
        setError(error.message);
      }
    };

    fetchDemandData();
  }, []);

  useEffect(() => {
    console.log('Updated demandData:', demandData); // Debugging: log state changes
  }, [demandData]);

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
        <div className='flex justify-center items-center text-center text-5xl p-6 bg-sky-800 text-white font-bold'>
          Pending Company Demand
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
            <button className="bg-sky-800 text-white p-2 rounded-md" onClick={() => window.location.reload()}>Refresh</button>
            <div className="overflow-x-auto mt-4">
              {error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border border-gray-300 text-center">Demand ID</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Company ID</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Product Type</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Product Name</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Model</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Brand</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Quantity</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDemands.length > 0 ? (
                      currentDemands.map((demand) => (
                        <tr key={demand.demandId}>
                          <td className="py-2 px-4 border border-gray-300 text-center">{demand.demandId}</td>
                          <td className="py-2 px-4 border border-gray-300 text-center">{demand.companyId}</td>
                          <td className="py-2 px-4 border border-gray-300 text-center">{demand.productType}</td>
                          <td className="py-2 px-4 border border-gray-300 text-center">{demand.productName}</td>
                          <td className="py-2 px-4 border border-gray-300 text-center">{demand.productModel}</td>
                          <td className="py-2 px-4 border border-gray-300 text-center">{demand.productBrand}</td>
                          <td className="py-2 px-4 border border-gray-300 text-center">{demand.productQuantity}</td>
                          <td className="py-2 px-4 border border-gray-300 text-center">{demand.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="py-2 px-4 border border-gray-300 text-center">
                          No demand requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
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

export default PendingCompanyDemand;
