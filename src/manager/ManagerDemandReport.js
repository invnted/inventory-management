import React, { useState, useEffect } from 'react';
import ManagerNavbar from '../components/ManagerNavbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getAllDemand`;

const userId = localStorage.getItem('userId') || 'N/A';

function ManagerDemandReport() {
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
                    body: JSON.stringify({ userId })
                });

                const result = await response.json();

                if (result.success) {
                    setDemands(result.demands || []); // Ensure it uses 'demands' from response
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

    const getStatusClassName = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'text-green-500 text-lg font-bold';
            case 'rejected':
                return 'text-red-500 text-lg font-bold';
            case 'pending':
                return 'text-blue-500 text-lg font-bold';
            default:
                return '';
        }
    };

    return (
        <div>
            <div className='bg-white h-screen'>
                <ManagerNavbar />
                <div className='flex justify-center items-center h-auto pb-5 gap-6 text-center text-white font-bold text-5xl m-10 md:mx-20 bg-sky-800'>
                    <div className='p-6 rounded-xl'>Demand Report</div>
                </div>

                <div className='bg-sky-300 mx-20'>
                    <form className="max-w-md mx-auto md:pt-20 p-6">
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
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
                                <table className="min-w-full bg-sky-300 border">
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
                                                    <td className={`py-2 px-4 border border-black text-center ${getStatusClassName(demand.status)}`}>{demand.status}</td>
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerDemandReport;
