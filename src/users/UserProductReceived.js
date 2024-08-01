import React, { useState, useEffect } from 'react';
import UserNavbar from './UserNavbar';
import { useNavigate } from 'react-router-dom';
import fetchWithToken from '../services/api';
import { toast } from 'react-toastify';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getProductReceived`;
const TICKETS_URL = `${serverUrl}/products/getAllTickets`;

function UserProductReceived() {
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(REQ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const result = await response.json();
          if (Array.isArray(result.products) && result.products.length > 0) {
            setProducts(result.products);
          } else {
            console.log('No products found for this user.');
          }
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await fetchWithToken(TICKETS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ issuedBy: userId }), // Adjust as needed
        });

        if (response.ok) {
          const result = await response.json();
          if (Array.isArray(result.tickets) && result.tickets.length > 0) {
            setTickets(result.tickets);
          } else {
            console.log('No tickets found for this user.');
          }
        } else {
          console.error('Failed to fetch tickets');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchData();
    fetchTickets();
  }, [userId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRaiseTicket = (productId) => {
    localStorage.setItem('productId', productId);
    localStorage.setItem('issuedBy', userId); // Save issuedBy in local storage
    navigate('/user-home/raise-ticket');
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='bg-white min-h-screen'>
      <UserNavbar />
      <div className='container mx-auto p-6'>
        <div className='bg-sky-300'>
          <div className='flex justify-center items-center bg-sky-800 p-8 text-4xl font-semibold text-white text-center'>
            Product Received
          </div> 

          <div className='bg-sky-300 text-white p-2 md:p-10'>
            <form className="mb-6">
              <div className="relative max-w-md mx-auto px-4">
                <input
                  type="search"
                  id="search"
                  className="block w-full p-4 rounded-lg bg-sky-800 placeholder-gray-300 text-white outline-none"
                  placeholder="Search Using Name / ID / Type / Brand / Model"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  required
                />
              </div>
            </form>
            <button
              className="bg-sky-700 text-white py-2 px-4 rounded-md shadow-md mb-6 hover:bg-sky-800 transition duration-300"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-black rounded-lg shadow-md">
                <thead className='bg-sky-700 text-white'>
                  <tr>
                    <th className="py-3 px-4 border border-black text-left">Product ID</th>
                    <th className="py-3 px-4 border border-black text-left">Product Type</th>
                    <th className="py-3 px-4 border border-black text-left">Product Name</th>
                    <th className="py-3 px-4 border border-black text-left">Product Brand</th>
                    <th className="py-3 px-4 border border-black text-left">Product Model</th>
                    <th className="py-3 px-4 border border-black text-left">Updated At</th>
                    <th className="py-3 px-4 border border-black text-left">Ticket Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => {
                      const ticket = tickets.find(ticket => ticket.productId === product.productId);
                      const ticketStatus = ticket ? ticket.status : 'UNRAISED';

                      return (
                        <tr key={product.productId} className='hover:bg-sky-50'>
                          <td className="py-2 px-4 border text-black border-black">{product.productId}</td>
                          <td className="py-2 px-4 border text-black border-black">{product.productType}</td>
                          <td className="py-2 px-4 border text-black border-black">{product.productName}</td>
                          <td className="py-2 px-4 border text-black border-black">{product.productBrand}</td>
                          <td className="py-2 px-4 border text-black border-black">{product.productModel}</td>
                          <td className="py-2 px-4 border text-black border-black">{new Date(product.updatedAt).toLocaleString()}</td>
                          <td className="py-2 px-4 border text-black border-black">
                            {ticketStatus === 'PENDING' ? (
                              <span className='text-red-500 font-bold'>PENDING</span>
                            ) : ticketStatus === 'UNDER REVIEW' ? (
                              <span className='text-red-500 font-bold'>Under Review</span>
                            ) : (
                              <button
                                onClick={() => handleRaiseTicket(product.productId)}
                                className='bg-sky-800 text-white p-2 rounded-lg text-center'
                              >
                                Raise Ticket
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-2 px-4 text-center text-black">No products found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-sky-700 text-white' : 'bg-sky-300 text-black'}`}
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

export default UserProductReceived;
