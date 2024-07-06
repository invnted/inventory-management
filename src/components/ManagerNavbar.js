import React from 'react'
import { Link } from 'react-router-dom';
import ProfilePhoto from '../Images/profile photo.jpg';
import { useRef, useState, useEffect } from 'react';
import AddUser from '../super-admin/AddUser';
import ManagerAddUser from '../manager/ManagerAddUser';

function ManagerNavbar() {
    const [open, setOpen] = useState(false);

    //Profile
    const managerId = localStorage.getItem('managerId') || 'N/A';
    const managerName = localStorage.getItem('managerName') || 'N/A';
    const designation = localStorage.getItem('designation') || 'N/A';

    //Permission
    const allProductReport = localStorage.getItem('allProductReport') || 'N/A';
    const demandReceived = localStorage.getItem('demandReceived') || 'N/A';
    const issueProduct = localStorage.getItem('issueProduct') || 'N/A';

    const Menus = [
        { label: "Manager ID", value: managerId },
        { label: "Name", value: managerName },
        { label: "Designation", value: designation },
        { label: "All Product Report", value: allProductReport },
        { label: "Demand Received", value: demandReceived },
        { label: "Issue Product", value: issueProduct }
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
            <nav className="bg-sky-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to='/user-home'>
                        <span className="hidden sm:block self-center text-3xl font-bold whitespace-nowrap dark:text-white">Manager Dashboard</span>
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
                    <ul className='flex flex-col md:flex-row gap-10 text-xl font-semibold text-white'>
                        <Link to='/manager-dashboard' className='hover:text-blue-900 delay-100'>
                            <li>Dashboard</li>
                        </Link>
                        <li>Add Category</li>
                        <Link to='/manager-dashboard/managerAdd-user'>
                        <li>
                            Add User
                        </li>
                        </Link>
                        <li>Demand</li>
                    </ul>
                </div>
            </nav>
        </div>
  )
}

export default ManagerNavbar