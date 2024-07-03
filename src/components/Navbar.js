import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import ProfilePhoto from '../Images/profile photo.jpg';
import { useLocation } from 'react-router-dom';

function Navbar() {
    const adminName = localStorage.getItem('adminName') || 'N/A';
    const email = localStorage.getItem('email') || 'N/A';
    const department = localStorage.getItem('department') || 'N/A';
    const profileID = localStorage.getItem('profileId') || 'N/A';
    const role = localStorage.getItem('role') || 'N/A';

    const Menus = [
        { label: "Admin Name", value: adminName },
        { label: "Email", value: email },
        { label: "Department", value: department },
        { label: "profile ID", value: profileID },
        { label: "Role", value: role }
    ];

    const [open, setOpen] = useState(false);

    const menuRef = useRef();
    const imgRef = useRef();

    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <span className="hidden sm:block self-center text-2xl font-bold whitespace-nowrap dark:text-white">Super Admin Dashboard</span>
                    
                    <div className="">
                        <ul className=" flex text-xl md:text-2xl text-white justify-center items-center">
                            <li>
                                <Link to='/home'  className=" py-2 px-3">Dashboard</Link>
                            </li>
                            <li>
                                <Link to='/reports'  className=" py-2 px-3">Reports</Link>
                            </li>
                        </ul>
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
            </nav>
        </div>
    );
}

export default Navbar;
