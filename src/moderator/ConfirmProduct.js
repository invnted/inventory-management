import React, { useEffect, useState } from 'react';
import ModeratorNavbar from './ModeratorNavbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const FILTER_URL = `${serverUrl}/products/filterProducts`;
const ASSIGN_URL = `${serverUrl}/products/assignSingleProduct`;

function ConfirmProduct() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const demandId = localStorage.getItem('demandId');
  const userId = localStorage.getItem('userId');
  const productType = localStorage.getItem('productType');
  const productModel = localStorage.getItem('productModel');
  const productBrand = localStorage.getItem('productBrand');

  useEffect(() => {
    fetchFilteredProducts();
  }, []);

  const fetchFilteredProducts = async () => {
    try {
      const response = await fetch(FILTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productType, productModel, productBrand })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filtered products');
      }

      const data = await response.json();
      console.log("data: ", data);

      if (data.success) {
        setFilteredProducts(data.filteredProducts);
      } else {
        console.error('Request successful but data.success is false:', data.message);
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  const handleAssign = async (demandId, productId) => {
    try {
      const response = await fetch(ASSIGN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ demandId, productId, userId })
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('Assigned demand with ID:', demandId, 'for product:', productId);
        fetchFilteredProducts(); // Refresh the data after assigning
      } else {
        console.error('Failed to assign product:', data.message);
      }
    } catch (error) {
      console.error('Error assigning product:', error);
    }
  };

  return (
    <div>
      <ModeratorNavbar />
      <div className='m-4 md:m-12 justify-between'>
        <div className='flex justify-center items-center text-5xl p-6 bg-sky-800 text-white font-bold'>
          Demand Requested
        </div>
        <div className='bg-sky-300'>
          <div className="p-2 md:p-10">
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-sky-100 border border-black">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border border-black text-center">Product ID</th>
                    <th className="py-2 px-4 border border-black text-center">Product Brand</th>
                    <th className="py-2 px-4 border border-black text-center">Product Model</th>
                    <th className="py-2 px-4 border border-black text-center">Demand ID</th>
                    <th className="py-2 px-4 border border-black text-center">User ID</th>
                    <th className="py-2 px-4 border border-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border border-black text-center">{product.productId}</td>
                      <td className="py-2 px-4 border border-black text-center">{product.productBrand}</td>
                      <td className="py-2 px-4 border border-black text-center">{product.productModel}</td>
                      <td className="py-2 px-4 border border-black text-center">{demandId}</td>
                      <td className="py-2 px-4 border border-black text-center">{userId}</td>
                      <td className="py-2 px-4 border border-black text-center">
                        <button
                          className="bg-sky-800 text-white px-2 py-1 rounded active:bg-sky-900"
                          onClick={() => handleAssign(demandId, product.productId)}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-2 px-4 border border-black text-center">
                        Store does not have stock of these products
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
