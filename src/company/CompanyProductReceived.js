import React, { useState, useEffect } from 'react';
import CompanyNavbar from './CompanyNavbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getProductReceived`;

const userId = localStorage.getItem('companyId');

function CompanyProductReceived() {
    const [products, setProducts] = useState([]);

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
                    setProducts(result.data);
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='bg-white h-screen'>
            <CompanyNavbar />
            <div className='bg-sky-300 m-4 md:m-20'>
                <div className='flex justify-center items-center text-5xl p-6 bg-sky-800 text-white font-bold text-center'>
                    Product Received
                </div>
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
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border border-black text-center">Product ID</th>
                                    <th className="py-2 px-4 border border-black text-center">Product Type</th>
                                    <th className="py-2 px-4 border border-black text-center">Product Name</th>
                                    <th className="py-2 px-4 border border-black text-center">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.productId}>
                                            <td className="py-2 px-4 border border-black text-center">{product.productId}</td>
                                            <td className="py-2 px-4 border border-black text-center">{product.productType}</td>
                                            <td className="py-2 px-4 border border-black text-center">{product.productName}</td>
                                            <td className="py-2 px-4 border border-black text-center">{new Date(product.dateAndTime).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-2 px-4 border border-black text-center">No products found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyProductReceived;
