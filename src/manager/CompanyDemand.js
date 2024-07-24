import React, { useEffect, useState } from 'react'
import ManagerNavbar from './ManagerNavbar'
import { Link } from 'react-router-dom';
import Demand from '../Images/demand1.png'

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getAllCompanyDemand`;
const UPDATE_URL = `${serverUrl}/products/updateCompanyDemandStatus`;

const companyId = localStorage.getItem('companyId');


function CompanyDemand() {
    const [demands, setDemands] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(REQ_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ companyId })
                });

                const result = await response.json();

                if (result.success) {
                    setDemands(result.demands || []);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                console.error('Error fetching demands:', error);
                setError('Error fetching demands');
            }
        };

        fetchData();
    }, []);

    const updateDemandStatus = async (demandId, status) => {
        try {
            const response = await fetch(UPDATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ demandId, status })
            });

            const result = await response.json();

            if (result.success) {
                setDemands(demands.map(demand =>
                    demand.demandId === demandId ? { ...demand, status: status } : demand
                ));
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error updating demand status:', error);
            setError('Error updating demand status');
        }
    };

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
    return (
        <div>
            <ManagerNavbar />
            <div className='m-4 md:m-12 '>
            <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
                    <div className='flex gap-4 md:gap-10'>
                        <Link to='/manager-dashboard/CompanyDemand'>
                            <div className='bg-gray-200 p-2 md:p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
                                <div className='w-10 md:w-14 block'>
                                    <img src={Demand} alt='Description' />
                                </div>
                                <div className='text-center text-sm md:text-lg font-semibold'>
                                    Demand Requested
                                </div>
                            </div>
                        </Link>
                        <Link to='/manager-dashboard/CompanyDemandReport'>
                            <div className='bg-gray-200 p-2 md:p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                                <div className='w-10 md:w-14 block'>
                                    <img src={Demand} alt='Description' />
                                </div>
                                <div className='text-center text-sm md:text-lg font-semibold'>
                                    Demand Reports
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className=' bg-sky-300 h-auto'>
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
                        <div className="overflow-x-auto mt-4">
                            {error ? (
                                <div className="text-red-500 text-center">{error}</div>
                            ) : (
                                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                    <thead className="bg-sky-500 text-white">
                                        <tr>
                                            <th className=" md:py-2 px-2 md:px-4 border border-black text-center">Demand ID</th>
                                            <th className=" md:py-2 px-2 md:px-4 border border-black text-center">Product Name</th>
                                            <th className=" md:py-2 px-2 md:px-4 border border-black text-center">Product Model</th>
                                            <th className=" md:py-2 px-2 md:px-4 border border-black text-center">Product Brand</th>
                                            <th className=" md:py-2 px-2 md:px-4 border border-black text-center">Product Quantity</th>
                                            <th className=" md:py-2 px-2 md:px-4 border border-black text-center">Status</th>
                                            <th className=" md:py-2 px-2 md:px-4 border border-black text-center">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demands.length > 0 ? (
                                            demands.map((demand) => (
                                                <tr key={demand.demandId} className="hover:bg-sky-100">
                                                    <td className=" md:py-2  md:px-4 border border-black text-center">{demand.demandId}</td>
                                                    <td className=" md:py-2  md:px-4 border border-black text-center">{demand.productName}</td>
                                                    <td className=" md:py-2  md:px-4 border border-black text-center">{demand.productModel}</td>
                                                    <td className=" md:py-2  md:px-4 border border-black text-center">{demand.productBrand}</td>
                                                    <td className=" md:py-2  md:px-4 border border-black text-center">{demand.productQuantity}</td>
                                                    <td className="py-1 md:py-2 px-2 md:px-4 border border-black text-center">
                                                        {demand.status.toLowerCase() === 'pending' ? (
                                                            <div className='flex justify-around text-white text-sm md:text-xl'>
                                                                <button className='bg-blue-500 px-2 py-1 rounded-lg hover:bg-blue-700' onClick={() => updateDemandStatus(demand.demandId, 'APPROVED')}>Approve</button>
                                                                <button className='bg-red-500 px-2 py-1 rounded-lg hover:bg-red-700' onClick={() => updateDemandStatus(demand.demandId, 'REJECTED')}>Reject</button>
                                                            </div>
                                                        ) : (
                                                            <span className={getStatusClassName(demand.status)}>{demand.status}</span>
                                                        )}
                                                    </td>
                                                    <td className=" md:py-2  md:px-4 border border-black text-center">{demand.createdAt}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className=" md:py-2 md:px-4 border border-black text-center">No demands found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDemand