import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import AddUsers from '../Images/add-user.png';
import List from '../Images/list.png';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const userListURL = `${serverUrl}/users/user-getAll`;
  const userEditURL = `${serverUrl}/users/user-update`;
  const userDeleteURL = `${serverUrl}/users/user-delete`;
  const userCSV = `${serverUrl}/users/download-user-csv`;

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(userListURL, {
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
      [name]: value
    });
  };

  const handleSaveClick = async (userId) => {
    try {
      const response = await fetch(userEditURL, {
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
        const response = await fetch(userDeleteURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const updatedUsers = users.filter(
            (user) => user.userId !== userId
          );
          setUsers(updatedUsers);
          toast.success('User deleted successfully');
        } else {
          toast.error('Failed to delete User');
        }
      } catch (error) {
        console.error('Error while deleting:', error);
        toast.error('An error occurred');
      }
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle CSV download
  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(userCSV, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
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
      <div className='m-4 md:m-12 justify-between'>
        <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
          <div className='flex gap-10'>
            <Link to='/home/add-user'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                <div className='w-10 block'>
                  <img src={AddUsers} alt='Description' />
                </div>
                <div>
                  <p>Add User </p>
                </div>
              </div>
            </Link>
            <Link to='/home/add-user/users-list'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500 '>
                <div className='w-10 block'>
                  <img src={List} alt='Description' />
                </div>
                <div>
                  <p>User List</p>
                </div>
              </div>
            </Link>
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
            <button onClick={fetchUsers} className="bg-sky-800 text-white p-2 rounded-md">Refresh</button>
            &nbsp;&nbsp;&nbsp;
            <button onClick={handleDownloadCSV} className="bg-sky-800 text-white p-2 rounded-md">Download CSV</button>
            {currentUsers.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border border-gray-300 text-center">User ID</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Name</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Designation</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Appointment</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Section</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Password</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.userId}>
                        <td className="py-2 px-4 border border-gray-300 text-center">{user.userId}</td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingUser === user.userId ? (
                            <input
                              type="text"
                              name="userName"
                              value={editedUser.userName}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            user.userName
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingUser === user.userId ? (
                            <input
                              type="text"
                              name="designation"
                              value={editedUser.designation}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            user.designation
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingUser === user.userId ? (
                            <input
                              type="text"
                              name="appointment"
                              value={editedUser.appointment}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            user.appointment
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingUser === user.userId ? (
                            <input
                              type="text"
                              name="section"
                              value={editedUser.section}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            user.section
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingUser === user.userId ? (
                            <input
                              type="text"
                              name="password"
                              value={editedUser.password}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            user.password
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingUser === user.userId ? (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900 mr-2"
                                onClick={() => handleSaveClick(user.userId)}
                              >
                                Save
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => setEditingUser(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="text-blue-600 hover:text-blue-900 mr-2"
                                onClick={() => handleEditClick(user)}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteClick(user.userId)}
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
            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersList;
