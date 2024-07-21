import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AddUsers from '../Images/add-user.png';
import List from '../Images/list.png';

function AllModerator() {
  const [moderators, setModerators] = useState([]);
  const [editingModerator, setEditingModerator] = useState(null);
  const [editedModerator, setEditedModerator] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const moderatorListURL = `${serverUrl}/moderators/moderator-getAll`;
  const moderatorEditURL = `${serverUrl}/moderators/moderator-update`;
  const moderatorDeleteURL = `${serverUrl}/moderators/moderator-delete`;
  const downloadCSVURL = `${serverUrl}/moderators/download-moderator-csv`; // CSV download URL

  // Function to fetch all moderators
  const fetchModerators = async () => {
    try {
      const response = await fetch(moderatorListURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Received:", data);
        setModerators(data);
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
    fetchModerators();
  }, []);

  const handleEditClick = (moderator) => {
    setEditingModerator(moderator.moderatorId);
    setEditedModerator(moderator);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedModerator({
      ...editedModerator,
      [name]: value,
    });
  };

  const handleSaveClick = async (moderatorId) => {
    try {
      const response = await fetch(moderatorEditURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedModerator),
      });

      if (response.ok) {
        const updatedModerators = moderators.map((moderator) =>
          moderator.moderatorId === moderatorId ? editedModerator : moderator
        );
        setModerators(updatedModerators);
        setEditingModerator(null);
        toast.success('Moderator updated successfully');
      } else {
        toast.error('Failed to update Moderator');
      }
    } catch (error) {
      console.error('Error while updating:', error);
      toast.error('An error occurred');
    }
  };

  const handleDeleteClick = async (moderatorId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this moderator?');
    if (confirmDelete) {
      try {
        const response = await fetch(moderatorDeleteURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ moderatorId }),
        });

        if (response.ok) {
          const updatedModerators = moderators.filter(
            (moderator) => moderator.moderatorId !== moderatorId
          );
          setModerators(updatedModerators);
          toast.success('Moderator deleted successfully');
        } else {
          toast.error('Failed to delete Moderator');
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

  // Filter moderators based on search term
  const filteredModerators = moderators.filter((moderator) =>
    moderator.moderatorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    moderator.moderatorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle CSV download
  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(downloadCSVURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Get the blob from the response
        const blob = await response.blob();
        // Create a link element
        const link = document.createElement('a');
        // Set the URL using the blob
        link.href = URL.createObjectURL(blob);
        link.download = 'moderators.csv'; // Filename
        // Append to the DOM and trigger click
        document.body.appendChild(link);
        link.click();
        // Clean up
        document.body.removeChild(link);
      } else {
        toast.error('Failed to download CSV');
      }
    } catch (error) {
      console.error('Error while downloading CSV:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <div>
      <Navbar />
      <div className='m-4 md:m-12 justify-between'>
        <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
          <div className='flex gap-10'>
            <Link to='/moderator-home/add-moderator'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                <div className='w-10 block'>
                  <img src={AddUsers} alt='Description' />
                </div>
                <div>
                  <p>Add Moderator </p>
                </div>
              </div>
            </Link>
            <Link to='/moderator-home/all-moderator'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500 '>
                <div className='w-10 block'>
                  <img src={List} alt='Description' />
                </div>
                <div>
                  <p>Moderator List</p>
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
            <button onClick={fetchModerators} className="bg-blue-500 text-white p-2 rounded-md">Refresh</button>
            <button onClick={handleDownloadCSV} className="bg-green-500 text-white p-2 rounded-md ml-4">Download CSV</button> {/* Download CSV Button */}
            {filteredModerators.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border border-gray-300 text-center">Moderator ID</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Name</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Designation</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Appointment</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Section</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Password</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModerators.map((moderator) => (
                      <tr key={moderator.moderatorId}>
                        <td className="py-2 px-4 border border-gray-300 text-center">{moderator.moderatorId}</td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingModerator === moderator.moderatorId ? (
                            <input
                              type="text"
                              name="moderatorName"
                              value={editedModerator.moderatorName}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            moderator.moderatorName
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingModerator === moderator.moderatorId ? (
                            <input
                              type="text"
                              name="designation"
                              value={editedModerator.designation}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            moderator.designation
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingModerator === moderator.moderatorId ? (
                            <input
                              type="text"
                              name="appointment"
                              value={editedModerator.appointment}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            moderator.appointment
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingModerator === moderator.moderatorId ? (
                            <input
                              type="text"
                              name="section"
                              value={editedModerator.section}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            moderator.section
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingModerator === moderator.moderatorId ? (
                            <input
                              type="text"
                              name="password"
                              value={editedModerator.password}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            moderator.password
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingModerator === moderator.moderatorId ? (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900 mr-2"
                                onClick={() => handleSaveClick(moderator.moderatorId)}
                              >
                                Save
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => setEditingModerator(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="text-blue-600 hover:text-blue-900 mr-2"
                                onClick={() => handleEditClick(moderator)}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteClick(moderator.moderatorId)}
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

export default AllModerator;
