import React, { useState, useEffect } from 'react';
import UserNavbar from '../components/UserNavbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/getProductReceived`;

function UserProductReceived() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(REQ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Fetched products:', result); // Debug log
          if (Array.isArray(result) && result.length > 0) {
            setProducts(result);
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

    fetchData();
  }, [userId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='bg-white min-h-screen'>
      <UserNavbar />
      <div className='container mx-auto p-6'>
        <div className='bg-sky-300'>
          <div className='flex justify-center items-center bg-sky-800 p-8 text-4xl font-semibold text-white'>
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
                <div className="absolute inset-y-0 right-6 md:right-8 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
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
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.productId} className='hover:bg-sky-50'>
                        <td className="py-2 px-4 border text-black border-black">{product.productId}</td>
                        <td className="py-2 px-4 border text-black border-black">{product.productType}</td>
                        <td className="py-2 px-4 border text-black border-black">{product.productName}</td>
                        <td className="py-2 px-4 border text-black border-black">{product.productBrand}</td>
                        <td className="py-2 px-4 border text-black border-black">{product.productModel}</td>
                        <td className="py-2 px-4 border text-black border-black">{new Date(product.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-2 px-4 text-center text-black">No products found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProductReceived;
