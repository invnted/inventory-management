import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import fetchWithToken from '../services/api';
import { toast } from 'react-toastify';
const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getOutOfStock`;

function StockRequiredInStore() {
    const [demands, setDemands] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOutOfStockDemands = async () => {
            try {
                const response = await fetchWithToken(REQ_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.outOfStockDemands) {
                    toast.success("Fetched Successfully");
                    setDemands(data.outOfStockDemands);
                } else {
                    setDemands([]);
                }

            } catch (error) {
                setError(error.message);
            }
        };

        fetchOutOfStockDemands();
    }, []);

    return (
        <div>
            <div className='bg-white h-screen'>
                <Navbar />
                <div className='bg-sky-300 m-10 md:m-20 rounded-lg'>
                    <div className='flex justify-around items-center py-2 gap-6 text-center text-white font-bold text-5xl bg-sky-800'>
                        <div className='p-6'>Stock Required</div>
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

                        <div className="overflow-x-auto mt-4">
                            {error ? (
                                <div className="text-red-500 text-center">{error}</div>
                            ) : (
                                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                    <thead className="bg-sky-500 text-white">
                                        <tr>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Product Type</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Product Brand</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Product Model</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Demand Quantity</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Available Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demands.length > 0 ? (
                                            demands.map((demand, index) => (
                                                <tr key={index} className="hover:bg-sky-100">
                                                    <td className="py-2 px-4 border border-gray-300 text-center">{demand.productType}</td>
                                                    <td className="py-2 px-4 border border-gray-300 text-center">{demand.productBrand}</td>
                                                    <td className="py-2 px-4 border border-gray-300 text-center">{demand.productModel}</td>
                                                    <td className="py-2 px-4 border border-gray-300 text-center">{demand.totalDemandQuantity}</td>
                                                    <td className="py-2 px-4 border border-gray-300 text-red-500 text-center font-bold">{demand.availableQuantity}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-2 px-4 border border-gray-300 text-center">No demands found</td>
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
    );
}

export default StockRequiredInStore;
