import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AddCompany from '../Images/AddCompany1.png';
import List from '../Images/list.png';

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editedCompany, setEditedCompany] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const companyListURL = `${serverUrl}/companies/company-getAll`;
  const companyEditURL = `${serverUrl}/companies/company-update`;
  const companyDeleteURL = `${serverUrl}/companies/company-delete`;
  const companiesCSV = `${serverUrl}/users/download-company-csv`;

  // Function to fetch all companies
  const fetchCompanies = async () => {
    try {
      const response = await fetch(companyListURL, {
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
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
    fetchCompanies();
  }, []);

  const handleEditClick = (company) => {
    setEditingCompany(company.companyId);
    setEditedCompany(company);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCompany({
      ...editedCompany,
      [name]: value
    });
  };

  const handleSaveClick = async (companyId) => {
    try {
      const response = await fetch(companyEditURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedCompany),
      });

      if (response.ok) {
        const updatedCompany = await response.json();
        const updatedCompanies = companies.map((company) =>
          company.companyId === companyId ? updatedCompany.company : company
        );
        setCompanies(updatedCompanies);
        setEditingCompany(null);
        toast.success('Company updated successfully');
      } else {
        toast.error('Failed to update company');
      }
    } catch (error) {
      console.error('Error while updating:', error);
      toast.error('An error occurred');
    }
  };

  const handleDeleteClick = async (companyId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this company?');
    if (confirmDelete) {
      try {
        const response = await fetch(companyDeleteURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ companyId }),
        });

        if (response.ok) {
          const updatedCompanies = companies.filter(
            (company) => company.companyId !== companyId
          );
          setCompanies(updatedCompanies);
          toast.success('Company deleted successfully');
        } else {
          toast.error('Failed to delete company');
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

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.companyId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle CSV download
  const handleDownloadCSV = async () => {
    try {
        const response = await fetch(companiesCSV, {
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
            a.download = 'companies.csv'; // Ensure filename is correct
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
            <Link to='/home/add-company'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer'>
                <div className='w-10 block'>
                  <img src={AddCompany} alt='Add Company' />
                </div>
                <div>
                  <p>Add Company</p>
                </div>
              </div>
            </Link>
            <Link to='/home/company-list'>
              <div className='bg-gray-200 p-4 h-32 w-32 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-4 border-blue-500'>
                <div className='w-10 block'>
                  <img src={List} alt='Company List' />
                </div>
                <div>
                  <p>Company List</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className='bg-sky-300'>
          <form className="max-w-md mx-auto md:pt-20 p-6">
            <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search" id="search" className="block w-full p-4 ps-10 text-sm rounded-lg bg-sky-800 placeholder-gray-300 outline-none text-white" placeholder="Search Using Name / ID" value={searchTerm} onChange={handleSearchChange} required />
            </div>
          </form>
          <div className="p-2 md:p-10">
            <button onClick={fetchCompanies} className="bg-sky-800 text-white p-2 rounded-md">Refresh</button>
            &nbsp;&nbsp;&nbsp;
            <button onClick={handleDownloadCSV} className="bg-sky-800 text-white p-2 rounded-md">Download CSV</button>
            {filteredCompanies.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border border-gray-300 text-center">Company ID</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Company Name</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Email</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Alternative Email</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Contact 1</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Contact 2</th>
                      <th className="py-2 px-4 border border-gray-300 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company) => (
                      <tr key={company.companyId}>
                        <td className="py-2 px-4 border border-gray-300 text-center">{company.companyId}</td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingCompany === company.companyId ? (
                            <input
                              type="text"
                              name="companyName"
                              value={editedCompany.companyName}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            company.companyName
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingCompany === company.companyId ? (
                            <input
                              type="email"
                              name="email"
                              value={editedCompany.email}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            company.email
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingCompany === company.companyId ? (
                            <input
                              type="email"
                              name="alternativeEmail"
                              value={editedCompany.alternativeEmail}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            company.alternativeEmail
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingCompany === company.companyId ? (
                            <input
                              type="text"
                              name="contact_1"
                              value={editedCompany.contact_1}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            company.contact_1
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingCompany === company.companyId ? (
                            <input
                              type="text"
                              name="contact_2"
                              value={editedCompany.contact_2}
                              onChange={handleInputChange}
                              className="bg-gray-200"
                            />
                          ) : (
                            company.contact_2
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          {editingCompany === company.companyId ? (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900 mr-2"
                                onClick={() => handleSaveClick(company.companyId)}
                              >
                                Save
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => setEditingCompany(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="text-blue-600 hover:text-blue-900 mr-2"
                                onClick={() => handleEditClick(company)}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteClick(company.companyId)}
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

export default CompanyList;
