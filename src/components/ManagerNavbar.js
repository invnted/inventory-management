import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from '../Images/profile photo.jpg';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const GET_OUT_OF_STOCK_URL = `${serverUrl}/products/getOutOfStock`;

function ManagerNavbar() {
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotificationDot, setShowNotificationDot] = useState(false);

    // Profile
    const managerId = localStorage.getItem('managerId') || 'N/A';
    const managerName = localStorage.getItem('managerName') || 'N/A';
    const designation = localStorage.getItem('designation') || 'N/A';

    const Menus = [
        { label: "Manager ID", value: managerId },
        { label: "Name", value: managerName },
        { label: "Designation", value: designation }
    ];

    const menuRef = useRef();
    const imgRef = useRef();

    useEffect(() => {
        const fetchOutOfStockItems = async () => {
            try {
                const response = await fetch(GET_OUT_OF_STOCK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any headers you need, e.g., authorization token
                    },
                    // You can pass any necessary data in the body, e.g., JSON.stringify({ key: value })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setShowNotificationDot(data.makeNotification);
            } catch (error) {
                console.error('Failed to fetch out-of-stock items:', error);
            }
        };

        fetchOutOfStockItems();
    }, []);

    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "/";
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex justify-around">
            <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-sky-800 text-white w-64 z-50`}>
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-2xl font-bold">Manager</h1>
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        ✕
                    </button>
                </div>
                <nav className="mt-10">
                    <Link to="/manager-dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Dashboard</Link>
                    <Link to="/manager-dashboard/manager-AddProduct" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Add Product</Link>
                    <Link to="/manager-dashboard/managerAdd-user" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Add User</Link>
                    <Link to="/manager-dashboard/ManagerDemandReport" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Demand</Link>
                    <Link to="/manager-dashboard/StockRequiredInStore" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Stock Required
                        {showNotificationDot && (
                            <span className="absolute h-3 w-3 bg-yellow-300 rounded-full"></span>
                        )}</Link>
                </nav>
            </div>
            <div className="flex-1 relative">
                <nav className="bg-sky-900">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <button
                            className="text-white hover:text-blue-500 md:hidden"
                            onClick={toggleSidebar}
                        >
                            ☰
                        </button>
                        <Link to='/manager-dashboard'>
                            <span className="hidden sm:block self-center text-3xl font-bold whitespace-nowrap dark:text-white">Manager Dashboard</span>
                        </Link>
                        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            <div className="relative flex text-sm rounded-full focus:ring-4 focus:ring-blue-600 mr-10">
                                <img
                                    ref={imgRef}
                                    src={ProfilePhoto}
                                    alt="face"
                                    onClick={() => setOpen(!open)}
                                    className="w-14 h-14 rounded-full border-4 border-sky-600 cursor-pointer"
                                />
                                {open && (
                                    <div ref={menuRef}
                                        className='bg-sky-600 p-6 shadow-2xl absolute text-white top-16 right-0 rounded-lg text-left z-10'>
                                        <ul className='space-y-2 '>
                                            {Menus.map((menu) => (
                                                <li
                                                    className='p-2 text-lg flex w-60' key={menu.label}>
                                                    <span className='font-bold'>{menu.label} :&nbsp;</span>{menu.value}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className='flex justify-center items-center text-2xl font-semibold text-gray-200 bg-red-400 hover:bg-red-600 rounded-lg p-2 mt-4'>
                                            <Link to='/'>
                                                <button onClick={logOut}>Logout</button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <ul className='hidden md:flex flex-col md:flex-row gap-10 text-xl font-semibold text-white'>
                            <Link to='/manager-dashboard' className='hover:text-blue-500 delay-100'>
                                <li>Dashboard</li>
                            </Link>
                            <Link to='/manager-dashboard/manager-AddProduct'>
                                <li className='hover:text-blue-500 delay-100'>Add Product</li>
                            </Link>
                            <Link to='/manager-dashboard/managerAdd-user'>
                                <li className='hover:text-blue-500 delay-100'>
                                    Add User
                                </li>
                            </Link>
                            <Link to='/manager-dashboard/ManagerDemand'>
                                <li className='hover:text-blue-500 delay-100'>Demand</li>
                            </Link>
                            <Link to='/manager-dashboard/StockRequiredInStore'>
                                <li className='hover:text-blue-500 delay-100'>
                                    Stock Required
                                    {showNotificationDot && (
                                        <span className="absolute h-3 w-3 bg-yellow-300 rounded-full"></span>
                                    )}
                                </li>
                            </Link>
                        </ul>
                    </div>
                    {/* <div className="hidden sm:block  md:hidden justify-around py-2">
                        <Link to='/manager-dashboard' className="text-white hover:text-blue-500 py-2 px-3">Dashboard</Link>
                        <Link to='/manager-dashboard/manager-AddProduct' className="text-white hover:text-blue-500 py-2 px-3">Add Product</Link>
                        <Link to='/manager-dashboard/managerAdd-user' className="text-white hover:text-blue-500 py-2 px-3">Add User</Link>
                        <Link to='/manager-dashboard/ManagerDemand' className="text-white hover:text-blue-500 py-2 px-3">Demand</Link>
                        <Link to='/manager-dashboard/ManagerDemand' className="text-white hover:text-blue-500 py-2 px-3">Stock Required</Link>
                        <Link to='/manager-dashboard/StockRequiredInStore' className="text-white hover:text-blue-500 py-2 px-3">
                            Stock Required
                            {showNotificationDot && (
                                <span className="absolute h-2 w-2 bg-red-600 rounded-full top-0 right-0 animate-ping slower"></span>
                            )}
                        </Link>
                    </div> */}
                </nav>
            </div>
        </div>
    )
}

export default ManagerNavbar;
