import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ModeratorNavbar from './ModeratorNavbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getAllDemand`;

function ConfirmProduct() {
  const [demandData, setDemandData] = useState([]);

  useEffect(() => {
    const fetchDemandData = async () => {
      try {
        const response = await fetch(REQ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched demand data:', data);
        if (data.success) {
          setDemandData(data.demands);
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

  const handleAssign = (demandId) => {
    // Handle assign logic here
    console.log('Assigned demand with ID:', demandId);
  };

  return (
    <div>
      <ModeratorNavbar />
      <div className='m-4 md:m-12 justify-between'>
        <div className='flex justify-center items-center text-5xl p-6 bg-sky-800 text-white font-bold'>
          Demand Requested
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
              <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm rounded-lg bg-sky-600 placeholder-gray-300 outline-none text-white" placeholder="Search Using Name / ID" required />
            </div>
          </form>
          <div className="p-2 md:p-10">
            <button className="bg-sky-800 text-white p-2 rounded-md">Refresh</button>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-sky-100 border border-black">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border border-black text-center">Demand ID</th>
                    <th className="py-2 px-4 border border-black text-center">User ID</th>
                    <th className="py-2 px-4 border border-black text-center">Product ID</th>
                    <th className="py-2 px-4 border border-black text-center">Product Type</th>
                    <th className="py-2 px-4 border border-black text-center">Model</th>
                    <th className="py-2 px-4 border border-black text-center">Brand</th>
                    <th className="py-2 px-4 border border-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demandData.length > 0 ? (
                    demandData.map((demand) => (
                      <tr key={demand.demandId}>
                        <td className="py-2 px-4 border border-black text-center">{demand.demandId}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.userId}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productId}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productType}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productModel}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productBrand}</td>
                        <td className="py-2 px-4 border border-black text-center">
                          <button
                            className="bg-sky-800 text-white px-2 py-1 rounded active:bg-sky-900"
                            onClick={() => handleAssign(demand.demandId)}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-2 px-4 border border-black text-center">
                        No demand requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




export default ConfirmProduct