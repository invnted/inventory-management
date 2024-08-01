import React, { useEffect, useState } from 'react';
import Navbar from '../super-admin/Navbar';
import ModeratorNavbar from './ModeratorNavbar';
import { Link } from 'react-router-dom';
import fetchWithToken from '../services/api';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/company-unissuedDemandList`;

function IssueForCompany() {
    const [demandData, setDemandData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const handleIssue = (demandId, companyId, productType, productName, productModel, productBrand, productQuantity) => {
        // Handle issue logic here
        localStorage.setItem('demandId', demandId);
        localStorage.setItem('companyId', companyId);
        localStorage.setItem('productBrand', productBrand);
        localStorage.setItem('productType', productType);
        localStorage.setItem('productName', productName);
        localStorage.setItem('productModel', productModel);
        localStorage.setItem('productQuantity', productQuantity);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = demandData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(demandData.length / itemsPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-4 py-2 mx-1 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border border-blue-500 rounded`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div>
            <ModeratorNavbar />
            <div className='m-4 md:m-12 justify-between'>
                <div className='flex justify-center items-center text-5xl p-6 bg-sky-800 text-white font-bold'>
                    Company Demand Requested
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
                                    {currentItems.length > 0 ? (
                                        currentItems.map((demand) => (
                                            <tr key={demand.demandId}>
                                                <td className="py-2 px-4 border border-black text-center">{demand.demandId}</td>
                                                <td className="py-2 px-4 border border-black text-center">{demand.companyId}</td>
                                                <td className="py-2 px-4 border border-black text-center">{demand.productType}</td>
                                                <td className="py-2 px-4 border border-black text-center">{demand.productName}</td>
                                                <td className="py-2 px-4 border border-black text-center">{demand.productModel}</td>
                                                <td className="py-2 px-4 border border-black text-center">{demand.productBrand}</td>
                                                <td className="py-2 px-4 border border-black text-center">{demand.productQuantity}</td>
                                                <td className="py-2 px-4 border border-black text-center">
                                                    <Link to='/moderator-home/confirm-company-product'>
                                                        <button
                                                            className="bg-sky-800 text-white px-2 py-1 rounded active:bg-sky-900"
                                                            onClick={() => handleIssue(demand.demandId, demand.companyId, demand.productType, demand.productName, demand.productModel, demand.productBrand, demand.productQuantity)}
                                                        >
                                                            Issue
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-2 px-4 border border-black text-center">
                                                No demand requests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
                            {renderPageNumbers()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueForCompany;
