import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from '../Images/profile photo.jpg';

function CompanyNavbar() {
    const companyName = localStorage.getItem('companyName') || 'N/A';
    const email = localStorage.getItem('email') || 'N/A';
    const companyId = localStorage.getItem('companyId') || 'N/A';
    const contact_1 = localStorage.getItem('contact_1') || 'N/A';

    const Menus = [
        { label: "Company ID", value: companyId },
        { label: "Company Name", value: companyName },
        { label: "Email", value: email },
        { label: "Contact", value: contact_1 }
    ];

    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuRef = useRef();
    const imgRef = useRef();

    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "/";
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex">
            <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-800 text-white w-64 z-50`}>
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-2xl font-bold">Company</h1>
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        ✕
                    </button>
                </div>
                <nav className="mt-10">
                    <Link to="/home" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ">Dashboard</Link>
                    <Link to="/reports" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Reports</Link>
                </nav>
            </div>
            <div className="flex-1">
                <nav className=" border-gray-200 bg-sky-900">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <button
                            className="text-gray-800 dark:text-gray-200 hover:text-blue-600 md:hidden"
                            onClick={toggleSidebar}
                        >
                            ☰
                        </button>
                        <span className="hidden sm:block self-center text-2xl font-bold whitespace-nowrap dark:text-white">Company Dashboard</span>
                        
                        <div className="hidden md:flex space-x-4">
                            <Link to='/home' className="text-gray-800 dark:text-gray-200 hover:text-blue-600 py-2 px-3">Dashboard</Link>
                            <Link to='/reports' className="text-gray-800 dark:text-gray-200 hover:text-blue-600 py-2 px-3">Reports</Link>
                        </div>

                        <div className="flex items-center md:order-2 space-x-3 md:space-x-0">
                            <div className="relative flex text-sm rounded-full focus:ring-4 focus:ring-blue-600">
                                <img
                                    ref={imgRef}
                                    src={ProfilePhoto}
                                    alt="face"
                                    onClick={() => setOpen(!open)}
                                    className="w-14 h-14 rounded-full border-4 border-sky-600 cursor-pointer"
                                />
                                {open && (
                                    <div ref={menuRef} className='bg-sky-600 p-6 shadow-2xl absolute text-white top-16 right-0 rounded-lg text-left z-10'>
                                        <ul className='space-y-2'>
                                            {Menus.map((menu, index) => (
                                                <li key={index} className='p-2 text-lg flex w-auto'>
                                                    <span className="font-semibold">{menu.label}&nbsp;:&nbsp;</span> {menu.value}
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
                    </div>
                    <div className="hidden sm:block  md:hidden justify-around py-2">
                        <Link to='/home' className="text-gray-800 dark:text-gray-200 hover:text-blue-600 py-2 px-3">Dashboard</Link>
                        <Link to='/reports' className="text-gray-800 dark:text-gray-200 hover:text-blue-600 py-2 px-3">Reports</Link>
                    </div>
                </nav>
            </div>
        </div>
    );
}




export default CompanyNavbar