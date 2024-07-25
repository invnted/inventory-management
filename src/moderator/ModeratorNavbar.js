import React from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from '../Images/profile photo.jpg';
import AsideIcon from '../Images/aside.png'; // Import the image
import { useRef, useState, useEffect } from 'react';

function ModeratorNavbar() {
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const moderatorName = localStorage.getItem('moderatorName') || 'N/A';
    const moderatorId = localStorage.getItem('moderatorId') || 'N/A';
    const designation = localStorage.getItem('designation') || 'N/A';

    const Menus = [
        { label: "Moderator ID", value: moderatorId },
        { label: "Name", value: moderatorName },
        { label: "Designation", value: designation }
    ];

    const menuRef = useRef();
    const imgRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && !imgRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div>
            <nav className="bg-sky-800">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <span className="self-center text-3xl font-bold whitespace-nowrap text-white hidden md:block">Moderator Dashboard</span>
                    <button
                        className="md:hidden text-white"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <img src={AsideIcon} alt="Menu" className="w-6 h-6" /> {/* Use the uploaded image */}
                    </button>
                    <ul className='hidden md:flex gap-10  font-semibold text-white'>
                        <Link to='/moderator-home' className='hover:text-blue-900 delay-100'>
                            <li>Dashboard</li>
                        </Link>
                        <Link to='/moderator-home/issue-product' className='hover:text-blue-900 delay-100'>
                            <li>Issue for User</li>
                        </Link>
                        <Link to='/moderator-home/issue-product-company' className='hover:text-blue-900 delay-100'>
                            <li>Issue for Company</li>
                        </Link>
                        <Link to='/moderator-home/user-ticket-received' className='hover:text-blue-900 delay-100'>
                            <li>User Ticket Received</li>
                        </Link>
                        <Link to='/moderator-home/company-ticket-received' className='hover:text-blue-900 delay-100'>
                            <li>Company Ticket Received</li>
                        </Link>
                    </ul>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <div className="relative flex text-sm rounded-full md:me-0 focus:ring-4 focus:ring-blue-600">
                            <img
                                ref={imgRef}
                                src={ProfilePhoto}
                                alt="face"
                                onClick={() => setOpen(!open)}
                                className="profile w-14 h-14 rounded-full border-4 border-sky-600 cursor-pointer"
                            />
                            {open && (
                                <div ref={menuRef}
                                    className='bg-sky-600 p-6 shadow-2xl absolute text-white top-16 right-0 rounded-lg text-left z-10'>
                                    <ul className='space-y-2'>
                                        {Menus.map((menu) => (
                                            <li className='p-2 text-lg flex w-60' key={menu.label}>
                                                <span className='font-bold'>{menu.label} :&nbsp;</span>{menu.value}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to='/'>
                                        <div className='flex justify-center items-center text-2xl font-semibold text-gray-200 bg-red-400 hover:bg-red-600 rounded-lg p-2 mt-4'>
                                            <button onClick={logOut}>Logout</button>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {sidebarOpen && (
                <aside className="fixed inset-0 z-30 flex">
                    <div className="flex-shrink-0 w-64 bg-sky-800 text-white">
                        <div className="flex justify-between items-center p-4">
                            <span className="text-2xl font-bold">Moderator Dashboard</span>
                            <button
                                className="text-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <ul className="space-y-2 p-4">
                            <li>
                                <Link to='/moderator-home' className='block px-4 py-2 hover:bg-blue-900 rounded'>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to='/moderator-home/issue-product' className='block px-4 py-2 hover:bg-blue-900 rounded'>
                                    Issue for User
                                </Link>
                            </li>
                            <li>
                                <Link to='/moderator-home/issue-product-company' className='block px-4 py-2 hover:bg-blue-900 rounded'>
                                    Issue for Company
                                </Link>
                            </li>
                            <li>
                                <Link to='/moderator-home/user-ticket-received' className='block px-4 py-2 hover:bg-blue-900 rounded'>
                                    Issue for Company
                                </Link>
                            </li>
                            <li>
                                <Link to='/moderator-home/company-ticket-received' className='block px-4 py-2 hover:bg-blue-900 rounded'>
                                    Issue for Company
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-grow bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
                </aside>
            )}
        </div>
    );
}

export default ModeratorNavbar;
