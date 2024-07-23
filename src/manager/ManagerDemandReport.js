import React, { useState, useEffect } from 'react';
import ManagerNavbar from './ManagerNavbar';
import DemandRequested from '../Images/demand1.png'
import { Link } from 'react-router-dom';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getAllDemand`;
const UPDATE_URL = `${serverUrl}/products/updateDemandStatus`;

const userId = localStorage.getItem('userId') || 'N/A';

function ManagerDemandReport() {
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

    const getStatusClassName = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'text-blue-500 text-sm md:text-lg font-bold';
            case 'rejected':
                return 'text-red-500 text-sm md:text-lg font-bold';
            case 'pending':
                return 'text-yellow-500 text-sm md:text-lg font-bold';
            case 'completed':
                return 'text-green-500 text-sm md:text-lg font-bold';
            default:
                return '';
        }
    };

    return (
        <div>
            <div className='bg-white min-h-screen'>
                <ManagerNavbar />
                <div className='bg-sky-300 m-4 md:m-20 '>
                    <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
                        <div className='flex gap-4 md:gap-10'>
                            <Link to='/manager-dashboard/ManagerDemand'>
                                <div className='bg-gray-200 p-2 md:p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                                    <div className='w-10 md:w-14 block'>
                                        <img src={DemandRequested} alt='Description' />
                                    </div>
                                    <div className='text-center text-sm md:text-lg font-semibold '>
                                        Demand Requested
                                    </div>
                                </div>
                            </Link>
                            <Link to='/manager-dashboard/ManagerDemandReport'>
                                <div className='bg-gray-200 p-2 md:p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
                                    <div className='w-10 md:w-14 block'>
                                        <img src={DemandRequested} alt='Description' />
                                    </div>
                                    <div className='text-center text-sm md:text-lg font-semibold'>
                                        Demand Reports
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <form className="max-w-md mx-auto md:pt-10 p-6">
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm rounded-lg bg-sky-900 placeholder-gray-300 outline-none text-white" placeholder="Search Using Name / ID" required />
                        </div>
                    </form>
                    <div className="p-2 md:p-10">
                        <button className="bg-sky-900 text-white p-2 rounded-md" onClick={() => window.location.reload()}>Refresh</button>

                        {/* Table */}
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full bg-sky-100 border border-black">
                                <thead>
                                    <tr>
                                        <th className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">Demand ID</th>
                                        <th className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">User ID</th>
                                        <th className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">Designation</th>
                                        <th className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">Product Type</th>
                                        <th className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">Product Name</th>
                                        <th className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">Model</th>
                                        <th className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">Brand</th>
                                        <th className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">Quantity</th>
                                        <th className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demandData.length > 0 ? (
                                        demandData.map((demand) => (
                                            <tr key={demand.demandId}>
                                                <td className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">{demand.demandId}</td>
                                                <td className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">{demand.userId}</td>
                                                <td className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">{demand.designation}</td>
                                                <td className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">{demand.productType}</td>
                                                <td className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">{demand.productName}</td>
                                                <td className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">{demand.productModel}</td>
                                                <td className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">{demand.productBrand}</td>
                                                <td className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">{demand.productQuantity}</td>
                                                <td className={`py-1 md:py-2 px-2 md:px-4 border border-black text-center ${getStatusClassName(demand.status)}`}>{demand.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">
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

export default ManagerDemandReport;
