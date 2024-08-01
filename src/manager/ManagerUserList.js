import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import ManagerNavbar from './ManagerNavbar';
import AddUsers from '../Images/add-user.png';
import List from '../Images/list.png';
import fetchWithToken from '../services/api';

function ManagerUserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const userListURL = `${serverUrl}/users/user-getAll`;
  const userEditURL = `${serverUrl}/users/user-update`;
  const userDeleteURL = `${serverUrl}/users/user-delete`;

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetchWithToken(userListURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received:", data);
        setUsers(data);
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
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user.userId);
    setEditedUser(user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSaveClick = async (userId) => {
    try {
      const response = await fetchWithToken(userEditURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const updatedUsers = users.map((user) =>
          user.userId === userId ? editedUser : user
        );
        setUsers(updatedUsers);
        setEditingUser(null);
        toast.success('User updated successfully');
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error while updating:', error);
      toast.error('An error occurred');
    }
  };

  const handleDeleteClick = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await fetchWithToken(userDeleteURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const updatedUsers = users.filter((user) => user.userId !== userId);
          setUsers(updatedUsers);
          toast.success('User deleted successfully');
        } else {
          toast.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error while deleting:', error);
        toast.error('An error occurred');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <ManagerNavbar />
      <div className='m-4 md:m-12'>
        <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
          <div className='flex gap-10'>
            <Link to='/manager-dashboard/managerAdd-user'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                <div className='w-10 block'>
                  <img src={AddUsers} alt='Add User' />
                </div>
                <div>
                  <p>Add User</p>
                </div>
              </div>
            </Link>
            <Link to='/manager-dashboard/manager-user-list'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
                <div className='w-10 block'>
                  <img src={List} alt='User List' />
                </div>
                <div>
                  <p>User List</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className='bg-sky-300 p-6'>
          <form className='max-w-md mx-auto'>
            <label htmlFor='search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
              Search
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <svg className='w-4 h-4 text-gray-500' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
                  <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z' />
                </svg>
              </div>
              <input
                type='search'
                id='search'
                className='block w-full p-4 pl-10 text-sm rounded-lg bg-sky-800 placeholder-gray-300 text-white outline-none'
                placeholder='Search Using Name / ID'
                value={searchTerm}
                onChange={handleSearchChange}
                required
              />
            </div>
          </form>
          <div className='p-2 md:p-10'>
            <button onClick={fetchUsers} className='bg-sky-800 text-white p-2 rounded-md'>Refresh</button>
            {currentUsers.length > 0 ? (
              <div className='overflow-x-auto mt-4'>
                <table className='min-w-full bg-white border border-gray-300'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 border border-gray-300 text-center'>User ID</th>
                      <th className='py-2 px-4 border border-gray-300 text-center'>Name</th>
                      <th className='py-2 px-4 border border-gray-300 text-center'>Designation</th>
                      <th className='py-2 px-4 border border-gray-300 text-center'>Appointment</th>
                      <th className='py-2 px-4 border border-gray-300 text-center'>Section</th>
                      <th className='py-2 px-4 border border-gray-300 text-center'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.userId}>
                        <td className='py-2 px-4 border border-gray-300 text-center'>{user.userId}</td>
                        <td className='py-2 px-4 border border-gray-300 text-center'>
                          {editingUser === user.userId ? (
                            <input
                              type='text'
                              name='userName'
                              value={editedUser.userName}
                              onChange={handleInputChange}
                              className='bg-gray-200 p-1 rounded'
                            />
                          ) : (
                            user.userName
                          )}
                        </td>
                        <td className='py-2 px-4 border border-gray-300 text-center'>
                          {editingUser === user.userId ? (
                            <input
                              type='text'
                              name='designation'
                              value={editedUser.designation}
                              onChange={handleInputChange}
                              className='bg-gray-200 p-1 rounded'
                            />
                          ) : (
                            user.designation
                          )}
                        </td>
                        <td className='py-2 px-4 border border-gray-300 text-center'>
                          {editingUser === user.userId ? (
                            <input
                              type='text'
                              name='appointment'
                              value={editedUser.appointment}
                              onChange={handleInputChange}
                              className='bg-gray-200 p-1 rounded'
                            />
                          ) : (
                            user.appointment
                          )}
                        </td>
                        <td className='py-2 px-4 border border-gray-300 text-center'>
                          {editingUser === user.userId ? (
                            <input
                              type='text'
                              name='section'
                              value={editedUser.section}
                              onChange={handleInputChange}
                              className='bg-gray-200 p-1 rounded'
                            />
                          ) : (
                            user.section
                          )}
                        </td>
                        <td className='py-2 px-4 border border-gray-300 text-center'>
                          {editingUser === user.userId ? (
                            <button onClick={() => handleSaveClick(user.userId)} className='bg-blue-500 text-white p-2 rounded'>
                              Save
                            </button>
                          ) : (
                            <>
                              <button onClick={() => handleEditClick(user)} className='bg-green-500 text-white p-2 rounded mr-2'>
                                Edit
                              </button>
                              <button onClick={() => handleDeleteClick(user.userId)} className='bg-red-500 text-white p-2 rounded'>
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='flex justify-between items-center mt-4'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='bg-gray-300 p-2 rounded'
                  >
                    Previous
                  </button>
                  <span className='text-sm'>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='bg-gray-300 p-2 rounded'
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p className='text-center text-gray-600 mt-4'>No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerUserList;
