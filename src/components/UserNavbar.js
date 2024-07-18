import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from '../Images/profile photo.jpg';

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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <div className="hidden md:block">
                        <Link to='/user-home'>
                            <span className="self-center text-3xl font-bold whitespace-nowrap text-white hover:text-blue-900 delay-100">User Dashboard</span>
                        </Link>
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
                        <Link to='/user-home/raise-demand' className='hover:text-blue-900 delay-100'>
                            <li>Raise Demand</li>
                        </Link>
                        <li>Product Received</li>
                        <li>Product Use</li>
                    </ul>
                </div>
            </nav>
            {menuOpen && (
                <aside className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-start md:hidden">
                    <div className="bg-white w-64 p-4">
                        <button className="text-black mb-4" onClick={() => setMenuOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <ul className='mt-4 space-y-4 text-black'>
                            <Link to='/user-home/raise-demand' className='hover:text-blue-900 delay-100' onClick={() => setMenuOpen(false)}>
                                <li>Raise Demand</li>
                            </Link>
                            <li>Product Received</li>
                            <li>Product Use</li>
                        </ul>
                    </div>
                </aside>
            )}
        </div>
    );
}

export default UserNavbar;
