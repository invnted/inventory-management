import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from '../Images/profile photo.jpg';
import MoreOptionsImage from '../Images/aside.png'; 

function UserNavbar() {
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const userName = localStorage.getItem('userName') || 'N/A';
    const userId = localStorage.getItem('userId') || 'N/A';
    const designation = localStorage.getItem('designation') || 'N/A';

    const Menus = [
        { label: "User ID", value: userId },
        { label: "Name", value: userName },
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
                    <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
                        <img src={MoreOptionsImage} alt="More options" className="w-6 h-6" />
                    </button>
                    <div className="hidden md:block">
                            <span className="self-center text-3xl font-bold whitespace-nowrap text-white">User Dashboard</span>
                    </div>
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
                                <div ref={menuRef} className='bg-sky-600 p-6 shadow-2xl absolute text-white top-16 right-0 rounded-lg text-left z-10'>
                                    <ul className='space-y-2'>
                                        {Menus.map((menu) => (
                                            <li className='p-2 text-lg flex w-60' key={menu.label}>
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
                    <ul className='hidden md:flex gap-10 text-xl font-semibold text-white'>
                        <Link to='/user-home' className='hover:text-blue-300'>
                            <li className=''>Dashboard</li>
                        </Link>
                        <Link to='/user-home/raise-demand' className='hover:text-blue-300'>
                            <li className=''>Raise Demand</li>
                        </Link>
                        <Link to='/user-home/product-received' className='hover:text-blue-300'>
                            <li className=''>Product Received</li>
                        </Link>
                        <Link to='' className='hover:text-blue-300'>
                            <li className=''>Product in Use</li>
                        </Link>
                    </ul>
                </div>
            </nav>
            {menuOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40">
                    <aside className="fixed top-0 left-0 h-full w-64 bg-sky-800 p-4 shadow-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-white text-2xl font-bold">User Dashboard</span>
                            <button className="text-white" onClick={() => setMenuOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <ul className='mt-6 space-y-4 text-white'>
                            <Link to='/user-home' className='hover:text-blue-300' onClick={() => setMenuOpen(false)}>
                                <li className='pt-4'>Dashboard</li>
                            </Link>
                            <Link to='/user-home/raise-demand' className='hover:text-blue-300' onClick={() => setMenuOpen(false)}>
                                <li className='pt-4'>Raise Demand</li>
                            </Link>
                            <Link to='/user-home/product-received' className='hover:text-blue-300' onClick={() => setMenuOpen(false)}>
                                <li className='pt-4'>Product Received</li>
                            </Link>
                            <Link to=''  className='hover:text-blue-300' onClick={() => setMenuOpen(false)}>
                                <li className='pt-4'>Product in Use</li>
                            </Link>
                        </ul>
                    </aside>
                </div>
            )}
        </div>
    );
}

export default UserNavbar;
