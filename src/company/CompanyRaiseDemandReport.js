import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';
import Demand from '../Images/demand1.png';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getCompanyDemand`;

const companyId = localStorage.getItem('companyId');

console.log("ID Picked for local storage: ", companyId);

function CompanyRaiseDemandReport() {
    const [demands, setDemands] = useState([]);

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
                    setDemands(Array.isArray(result.data) ? result.data : []);
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error('Error fetching demands:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='bg-white h-screen'>
            <CompanyNavbar />
            <div className='grid grid-cols-1 justify-center items-center bg-white'>
                <div className='grid grid-cols-1 justify-center items-center m-4 md:m-10 md:mx-20 bg-sky-300'>
                    <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
                        <div className='flex gap-10'>
                            <Link to='/company-home/raise-demand'>
                                <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                                    <div className='w-14 block'>
                                        <img src={Demand} alt='Description' />
                                    </div>
                                    <div className='text-lg font-semibold'>
                                        Raise Demand
                                    </div>
                                </div>
                            </Link>
                            <Link to='/company-home/raise-demand-report'>
                                <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
                                    <div className='w-14 block'>
                                        <img src={Demand} alt='Description' />
                                    </div>
                                    <div className='text-lg font-semibold'>
                                        Demand Reports
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className=''>
                        <form className="max-w-md mx-auto md:pt-20 p-10">
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
                        <div className="p-4 md:p-10">
                            <button className="bg-sky-800 text-white p-2 rounded-md">Refresh</button>
                            <div className="overflow-x-auto mt-4">
                                <table className="min-w-full bg-sky-200 border">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border border-black text-center">Demand ID</th>
                                            <th className="py-2 px-4 border border-black text-center">Product Name</th>
                                            <th className="py-2 px-4 border border-black text-center">Product Model</th>
                                            <th className="py-2 px-4 border border-black text-center">Product Brand</th>
                                            <th className="py-2 px-4 border border-black text-center">Product Quantity</th>
                                            <th className="py-2 px-4 border border-black text-center">Status</th>
                                            <th className="py-2 px-4 border border-black text-center">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demands.length > 0 ? (
                                            demands.map((demand) => (
                                                <tr key={demand.demandId}>
                                                    <td className="py-2 px-4 border border-black text-center">{demand.demandId}</td>
                                                    <td className="py-2 px-4 border border-black text-center">{demand.productName}</td>
                                                    <td className="py-2 px-4 border border-black text-center">{demand.productModel}</td>
                                                    <td className="py-2 px-4 border border-black text-center">{demand.productBrand}</td>
                                                    <td className="py-2 px-4 border border-black text-center">{demand.productQuantity}</td>
                                                    <td className="py-2 px-4 border border-black text-center">{demand.status}</td>
                                                    <td className="py-2 px-4 border border-black text-center">{demand.createdAt}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="py-2 px-4 border border-black text-center">No demands found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyRaiseDemandReport;
