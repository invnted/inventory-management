import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Manager from '../Images/add.png';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

function AllManager() {
    const [managers, setManagers] = useState([]);
    const [editingManager, setEditingManager] = useState(null);
    const [editedManager, setEditedManager] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const managerListURL = `${serverUrl}/managers/manager-getAll`;
    const managerEditURL = `${serverUrl}/managers/manager-update`;
    const managerDeleteURL = `${serverUrl}/managers/manager-delete`;
    const managerCSV = `${serverUrl}/managers/download-manager-csv`;

    // Function to fetch all managers
    const fetchManagers = async () => {
        try {
            const response = await fetch(managerListURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Received:", data);
                setManagers(data);
                toast.success('Successfully fetched data');
            } else {
                toast.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error while fetching:', error);
            toast.error('An error occurred');
        }
    };

    useEffect(() => {
        fetchManagers();
    }, []);

    const handleEditClick = (manager) => {
        setEditingManager(manager.managerId);
        setEditedManager(manager);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'allProductReport' || name === 'demandReceived' || name === 'issueProduct') {
            setEditedManager({
                ...editedManager,
                [name]: value === 'true'
            });
        } else {
            setEditedManager({
                ...editedManager,
                [name]: value
            });
        }
    };

    const handleSaveClick = async (managerId) => {
        try {
            const response = await fetch(managerEditURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedManager),
            });

            if (response.ok) {
                const updatedManagers = managers.map((manager) =>
                    manager.managerId === managerId ? editedManager : manager
                );
                setManagers(updatedManagers);
                setEditingManager(null);
                toast.success('Manager updated successfully');
            } else {
                toast.error('Failed to update manager');
            }
        } catch (error) {
            console.error('Error while updating:', error);
            toast.error('An error occurred');
        }
    };

    const handleDeleteClick = async (managerId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this manager?');
        if (confirmDelete) {
            try {
                const response = await fetch(managerDeleteURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ managerId }),
                });

                if (response.ok) {
                    const updatedManagers = managers.filter(
                        (manager) => manager.managerId !== managerId
                    );
                    setManagers(updatedManagers);
                    toast.success('Manager deleted successfully');
                } else {
                    toast.error('Failed to delete manager');
                }
            } catch (error) {
                console.error('Error while deleting:', error);
                toast.error('An error occurred');
            }
        }
    };

    const getPermissionIcon = (permission) => {
        return permission ? '✔' : '❌';
    };

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter managers based on search term
    const filteredManagers = managers.filter((manager) =>
        manager.managerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.managerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to handle CSV download
    const handleDownloadCSV = async () => {
        try {
            const response = await fetch(managerCSV, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // This is typically optional for downloads
                },
            });
    
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'managers.csv'; // Ensure filename is correct
                document.body.appendChild(a);
                a.click();
                a.remove();
                toast.success('CSV file downloaded successfully');
            } else {
                console.error('Failed to download CSV:', response.statusText);
                toast.error('Failed to download CSV');
            }
        } catch (error) {
            console.error('Error while downloading CSV:', error);
            toast.error('An error occurred while downloading CSV');
        }
    };
    

    return (
        <div>
            <Navbar />
            <div className='m-4 md:m-12  justify-between'>
                <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
                    <div className='flex gap-10'>
                        <Link to='/home/add-manager'>
                            <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                                <div className='w-10 block'>
                                    <img src={Manager} alt='Add Manager' />
                                </div>
                                <div>
                                    <p>Add <br /> Manager</p>
                                </div>
                            </div>
                        </Link>
                        <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
                            <div className='w-10 block'>
                                <img src={Manager} alt='All Managers' />
                            </div>
                            <div>
                                <p>All <br /> Managers</p>
                            </div>
                        </div>
                    </div>
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
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm rounded-lg bg-sky-800 placeholder-gray-300 outline-none text-white" placeholder="Search Using Name / ID" value={searchTerm} onChange={handleSearchChange} required />
                        </div>
                    </form>
                    <div className="p-2 md:p-10">
                        <button onClick={fetchManagers} className="bg-sky-800 text-white p-2 rounded-md mr-4">Refresh</button>
                        <button onClick={handleDownloadCSV} className="bg-sky-800 text-white p-2 rounded-md">Download CSV</button>
                        {filteredManagers.length > 0 && (
                            <div className="overflow-x-auto mt-4">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Manager ID</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Manager Name</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Password</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Designation</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Section</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Appointment</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">All Product Report</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Demand Received</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Issue Product</th>
                                            <th className="py-2 px-4 border border-gray-300 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredManagers.map((manager) => (
                                            <tr key={manager.managerId}>
                                                <td className="py-2 px-4 border border-gray-300 text-center">{manager.managerId}</td>
                                                <td className="py-2 px-4 border border-gray-300 text-center">
                                                    {editingManager === manager.managerId ? (
                                                        <input
                                                            type="text"
                                                            name="managerName"
                                                            value={editedManager.managerName}
                                                            onChange={handleInputChange}
                                                            className="bg-gray-200"
                                                        />
                                                    ) : (
                                                        manager.managerName
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border border-gray-300 text-center">
                                                    {editingManager === manager.managerId ? (
                                                        <input
                                                            type="text"
                                                            name="password"
                                                            value={editedManager.password}
                                                            onChange={handleInputChange}
                                                            className="bg-gray-200"
                                                        />
                                                    ) : (
                                                        manager.password
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border border-gray-300 text-center">
                                                    {editingManager === manager.managerId ? (
                                                        <input
                                                            type="text"
                                                            name="designation"
                                                            value={editedManager.designation}
                                                            onChange={handleInputChange}
                                                            className="bg-gray-200"
                                                        />
                                                    ) : (
                                                        manager.designation
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border border-gray-300 text-center">
                                                    {editingManager === manager.managerId ? (
                                                        <input
                                                            type="text"
                                                            name="section"
                                                            value={editedManager.section}
                                                            onChange={handleInputChange}
                                                            className="bg-gray-200"
                                                        />
                                                    ) : (
                                                        manager.section
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border border-gray-300 text-center">
                                                    {editingManager === manager.managerId ? (
                                                        <input
                                                            type="text"
                                                            name="appointment"
                                                            value={editedManager.appointment}
                                                            onChange={handleInputChange}
                                                            className="bg-gray-200"
                                                        />
                                                    ) : (
                                                        manager.appointment
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border border-gray-300 text-center">
                                                    {editingManager === manager.managerId ? (
                                                        <select
                                                            name="allProductReport"
                                                            value={editedManager.allProductReport}
                                                            onChange={handleInputChange}
                                                            className="bg-gray-200"
                                                        >
                                                            <option value={true}>✔</option>
                                                            <option value={false}>❌</option>
                                                        </select>
                                                    ) : (
                                                        getPermissionIcon(manager.allProductReport)
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border border-gray-300 text-center">
                                                    {editingManager === manager.managerId ? (
                                                        <select
                                                            name="demandReceived"
                                                            value={editedManager.demandReceived}
                                                            onChange={handleInputChange}
                                                            className="bg-gray-200"
                                                        >
                                                            <option value={true}>✔</option>
                                                            <option value={false}>❌</option>
                                                        </select>
                                                    ) : (
                                                        getPermissionIcon(manager.demandReceived)
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border border-gray-300 text-center">
                                                    {editingManager === manager.managerId ? (
                                                        <select
                                                            name="issueProduct"
                                                            value={editedManager.issueProduct}
                                                            onChange={handleInputChange}
                                                            className="bg-gray-200"
                                                        >
                                                            <option value={true}>✔</option>
                                                            <option value={false}>❌</option>
                                                        </select>
                                                    ) : (
                                                        getPermissionIcon(manager.issueProduct)
                                                    )}
                                                </td>

                                                <td className="py-2 px-4 border border-gray-300 text-center">
                                                    {editingManager === manager.managerId ? (
                                                        <>
                                                            <button
                                                                className="text-green-600 hover:text-green-900 mr-2"
                                                                onClick={() => handleSaveClick(manager.managerId)}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                className="text-gray-600 hover:text-gray-900"
                                                                onClick={() => setEditingManager(null)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="text-blue-600 hover:text-blue-900 mr-2"
                                                                onClick={() => handleEditClick(manager)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-900"
                                                                onClick={() => handleDeleteClick(manager.managerId)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllManager;
