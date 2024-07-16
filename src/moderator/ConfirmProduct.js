import React, { useEffect, useState } from 'react';
import ModeratorNavbar from './ModeratorNavbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const REQ_URL = `${serverUrl}/products/filterProducts`;

function ConfirmProduct() {
  const [demandData, setDemandData] = useState([]);
  const [filters, setFilters] = useState({
    productType: localStorage.getItem('productType') || '',
    productModel: localStorage.getItem('productModel') || '',
    productBrand: localStorage.getItem('productBrand') || ''
  });

  const fetchDemandData = async () => {
    try {
      const response = await fetch(REQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters)
      });
      const data = await response.json();
      console.log('Fetched demand data:', data);
      if (data.success) {
        setDemandData(data.filteredProducts);
      }
    } catch (error) {
      console.error('Error fetching demand data:', error);
    }
  };

  useEffect(() => {
    fetchDemandData();
  }, [filters]);

  const handleAssign = (demandId, productId, productType, productBrand, productModel) => {
    // Handle assign logic here
    console.log('Assigned demand with ID:', demandId, 'for product:', productId);
    // Perform your assign logic, e.g., update database, show confirmation, etc.
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('productType', filters.productType);
    localStorage.setItem('productModel', filters.productModel);
    localStorage.setItem('productBrand', filters.productBrand);
    fetchDemandData();
  };

  const handleRefresh = () => {
    fetchDemandData();
  };

  return (
    <div>
      <ModeratorNavbar />
      <div className='m-4 md:m-12 justify-between'>
        <div className='flex justify-center items-center text-5xl p-6 bg-sky-800 text-white font-bold'>
          Demand Requested
        </div>
        <div className='bg-sky-300'>
          <form className="max-w-md mx-auto md:pt-20 p-6" onSubmit={handleFilterSubmit}>
            <label htmlFor="productType" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Product Type</label>
            <input 
              type="text" 
              id="productType" 
              name="productType" 
              className="block w-full p-4 mb-2 text-sm rounded-lg bg-sky-600 placeholder-gray-300 outline-none text-white" 
              placeholder="Product Type" 
              value={filters.productType} 
              onChange={handleFilterChange} 
            />
            <label htmlFor="productModel" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Product Model</label>
            <input 
              type="text" 
              id="productModel" 
              name="productModel" 
              className="block w-full p-4 mb-2 text-sm rounded-lg bg-sky-600 placeholder-gray-300 outline-none text-white" 
              placeholder="Product Model" 
              value={filters.productModel} 
              onChange={handleFilterChange} 
            />
            <label htmlFor="productBrand" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Product Brand</label>
            <input 
              type="text" 
              id="productBrand" 
              name="productBrand" 
              className="block w-full p-4 mb-2 text-sm rounded-lg bg-sky-600 placeholder-gray-300 outline-none text-white" 
              placeholder="Product Brand" 
              value={filters.productBrand} 
              onChange={handleFilterChange} 
            />
            <button 
              type="submit" 
              className="block w-full p-4 text-sm rounded-lg bg-sky-800 text-white mt-2"
            >
              Search
            </button>
          </form>
          <div className="p-2 md:p-10">
            <button 
              className="bg-sky-800 text-white p-2 rounded-md"
              onClick={handleRefresh}
            >
              Refresh
            </button>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-sky-100 border border-black">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border border-black text-center">Demand ID</th>
                    <th className="py-2 px-4 border border-black text-center">User ID</th>
                    <th className="py-2 px-4 border border-black text-center">Product ID</th>
                    <th className="py-2 px-4 border border-black text-center">Product Type</th>
                    <th className="py-2 px-4 border border-black text-center">Model</th>
                    <th className="py-2 px-4 border border-black text-center">Brand</th>
                    <th className="py-2 px-4 border border-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demandData.length > 0 ? (
                    demandData.map((demand) => (
                      <tr key={demand.demandId}>
                        <td className="py-2 px-4 border border-black text-center">{demand.demandId}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.userId}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productId}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productType}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productModel}</td>
                        <td className="py-2 px-4 border border-black text-center">{demand.productBrand}</td>
                        <td className="py-2 px-4 border border-black text-center">
                          <button
                            className="bg-sky-800 text-white px-2 py-1 rounded active:bg-sky-900"
                            onClick={() => handleAssign(demand.demandId, demand.productId, demand.productType, demand.productBrand, demand.productModel)}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-2 px-4 border border-black text-center">
                        No demand requests found.
                      </td>
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

export default ConfirmProduct;
