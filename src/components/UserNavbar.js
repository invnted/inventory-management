import React from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from '../Images/profile photo.jpg';
import { useRef, useState, useEffect } from 'react';

function UserNavbar() {
    const [open, setOpen] = useState(false);

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
            <nav className="bg-purple-600">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to='/user-home'>
                        <span className="self-center text-3xl font-bold whitespace-nowrap text-white hover:text-blue-900 delay-100">User Dashboard</span>
                    </Link>
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
                                    className='bg-sky-600 p-6 shadow-2xl  absolute text-white top-16 right-0 rounded-lg text-left z-10'>
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
                    <ul className='flex gap-10 text-xl font-semibold text-white'>
                        <Link to='/user-home/raise-demand' className='hover:text-blue-900 delay-100'>
                            <li>Raise Demand</li>
                        </Link>
                        <li>Product Received</li>
                        <li>Product Use</li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default UserNavbar;
