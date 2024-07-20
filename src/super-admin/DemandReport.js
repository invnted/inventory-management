import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const productListUrl = `${serverUrl}/products/getAllProduct`;
const storeReportUrl = `${serverUrl}/products/storeReport`;

function DemandReport() {
    const [productTypes, setProductTypes] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('');
    const [productModels, setProductModels] = useState([]);
    const [productBrands, setProductBrands] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(productListUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('Fetched products:', data);
                setProductTypes(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleProductTypeChange = (e) => {
        const selectedType = e.target.value;
        setSelectedProductType(selectedType);

        if (selectedType) {
            const selectedProduct = productTypes.find(product => product.productType === selectedType);
            setProductModels([...new Set(selectedProduct.details.map(detail => detail.productModel))]);
            setProductBrands([...new Set(selectedProduct.details.map(detail => detail.productBrand))]);
            setStatuses([...new Set(selectedProduct.details.map(detail => detail.status))]);
        } else {
            setProductModels([]);
            setProductBrands([]);
            setStatuses([]);
        }
    };

    const handleViewClick = async () => {
        const query = {
            productType: selectedProductType,
            productModel: document.querySelector('select[name="productModel"]').value,
            productBrand: document.querySelector('select[name="productBrand"]').value,
            status: document.querySelector('select[name="status"]').value,
            fromDate,
            toDate
        };

        try {
            const response = await fetch(storeReportUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(query),
            });
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

    const data = [
        { demandId: 1, userId: 101, userName: 'Anup Mondal', product: 'Keyboard', quantity: 5, dateTime: '2024-07-10T12:00:00Z' },
        { demandId: 2, userId: 102, userName: 'Ayush Kothari', product: 'Laptop', quantity: 10, dateTime: '2024-07-10T13:00:00Z' },
        { demandId: 3, userId: 103, userName: 'Rahul Dasila', product: 'Monitor', quantity: 3, dateTime: '2024-07-10T14:00:00Z' },
    ];

    return (
        <div className='min-h-screen '>
            <Navbar />
            <div className='md:m-10 m-4'>
                <div className='bg-sky-300 '>
                    <div className='flex justify-center items-center bg-sky-800 p-8 text-white text-4xl font-bold'>
                        Demand Report
                    </div>
                    <form className='flex flex-wrap justify-center items-center text-center text-white m-10'>
                        <div className='w-full md:w-1/4 p-2'>
                            <div className='relative inline-block w-full text-black'>
                                <select
                                    className='block appearance-none w-full bg-sky-700 text-xl text-white p-3 rounded leading-tight focus:outline-none focus:shadow-outline'
                                    value={selectedProductType}
                                    onChange={handleProductTypeChange}
                                >
                                    <option value=''>Select Product Type</option>
                                    {productTypes.map((productType, index) => (
                                        <option
                                            value={productType.productType}
                                            key={index}
                                            className='bg-sky-700 delay-100 h-20 flex text-white justify-center items-center rounded-xl font-bold cursor-pointer'
                                        >
                                            {productType.productType}
                                        </option>
                                    ))}
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white'>
                                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                                        <path d='M7 10l5 5 5-5H7z' />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className='w-full md:w-1/4 p-2 flex flex-col md:flex-row md:items-center'>
                            <div className='text-black text-xl font-semibold md:mr-2'>From Date:</div>
                            <input
                                type='date'
                                id='fromDate'
                                name='fromDate'
                                className='bg-sky-700 rounded-lg px-4 py-2 w-full md:w-auto focus:outline-none focus:border-blue-500'
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className='w-full md:w-1/4 p-2 flex flex-col md:flex-row md:items-center'>
                            <div className='text-black text-xl font-semibold md:mr-2'>To Date:</div>
                            <input
                                type='date'
                                id='toDate'
                                name='toDate'
                                className='bg-sky-700 rounded-lg px-4 py-2 w-full md:w-auto focus:outline-none focus:border-blue-500'
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                        <div className='flex justify-around items-center w-full md:w-1/2 p-2 m-10'>
                            <button
                                type="button"
                                className='bg-sky-900 w-40 p-3 text-white text-2xl rounded-2xl'
                                onClick={handleViewClick}
                            >
                                View
                            </button>
                            <div className='p-2'>
                                <button className='bg-sky-900 w-40 p-3 text-white text-2xl rounded-2xl'>Download</button>
                            </div>
                        </div>
                    </form>
                    <div className="overflow-x-auto md:p-10 p-4">
                        <table className="min-w-full leading-normal border border-black">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border border-black bg-sky-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Demand ID</th>
                                    <th className="px-5 py-3 border border-black bg-sky-700 text-left text-xs font-semibold text-white uppercase tracking-wider">User ID</th>
                                    <th className="px-5 py-3 border border-black bg-sky-700 text-left text-xs font-semibold text-white uppercase tracking-wider">User Name</th>
                                    <th className="px-5 py-3 border border-black bg-sky-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Product</th>
                                    <th className="px-5 py-3 border border-black bg-sky-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Quantity</th>
                                    <th className="px-5 py-3 border border-black bg-sky-700 text-left text-xs font-semibold text-white uppercase tracking-wider">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((demand, index) => (
                                    <tr key={index}>
                                        <td className="px-5 py-5 border border-black bg-white text-sm">{demand.demandId}</td>
                                        <td className="px-5 py-5 border border-black bg-white text-sm">{demand.userId}</td>
                                        <td className="px-5 py-5 border border-black bg-white text-sm">{demand.userName}</td>
                                        <td className="px-5 py-5 border border-black bg-white text-sm">{demand.product}</td>
                                        <td className="px-5 py-5 border border-black bg-white text-sm">{demand.quantity}</td>
                                        <td className="px-5 py-5 border border-black bg-white text-sm">{new Date(demand.dateTime).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DemandReport;
