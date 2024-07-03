import React, { useEffect, useState } from 'react';
import Bg from '../Images/bg1.jpg';
import Navbar from '../components/Navbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const productListUrl = `${serverUrl}/products/getAllProduct`;
const storeReportUrl = `${serverUrl}/products/storeReport`;

function StoreReport() {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [productModels, setProductModels] = useState([]);
  const [productBrands, setProductBrands] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(productListUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched products:', data);
        setProductTypes(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedProductType(selectedType);

    if (selectedType) {
      const selectedProduct = productTypes.find(product => product.productType === selectedType);
      setProductModels([...new Set(selectedProduct.details.map(detail => detail.productModel))]);
      setProductBrands([...new Set(selectedProduct.details.map(detail => detail.productBrand))]);
      setStatuses([...new Set(selectedProduct.details.map(detail => detail.status))]);
    } else {
      setProductModels([]);
      setProductBrands([]);
      setStatuses([]);
    }
  };

  const handleViewClick = async () => {
    const query = {
      productType: selectedProductType,
      productModel: document.querySelector('select[name="productModel"]').value,
      productBrand: document.querySelector('select[name="productBrand"]').value,
      status: document.querySelector('select[name="status"]').value,
      fromDate,
      toDate
    };

    try {
      const response = await fetch(storeReportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  return (
    <div className='h-cover'>
      <Navbar />
      <div className='relative'>
        <img src={Bg} className='w-screen h-screen object-cover' />
        <div className='absolute inset-0 m-20'>
          <div className='border border-black'>
            <div className='flex justify-center items-center bg-sky-950 p-8 tex-bold text-white  text-4xl'>Store Report</div>
            <form className='flex flex-wrap justify-center items-center text-center text-white m-10 '>
              <div className='w-full md:w-1/4'>
                <div>
                  <div className='relative inline-block w-64 text-black'>
                    <select
                      className='block appearance-none w-full bg-sky-700 text-xl text-white p-3 rounded leading-tight focus:outline-none focus:shadow-outline'
                      value={selectedProductType}
                      onChange={handleProductTypeChange}
                    >
                      <option value=''>Select Product Type</option>
                      {productTypes.map((productType, index) => (
                        <option
                          value={productType.productType}
                          key={index}
                          className='bg-sky-700 delay-100 h-20 flex text-white justify-center items-center rounded-xl font-bold cursor-pointer'
                        >
                          {productType.productType}
                        </option>
                      ))}
                    </select>
                    <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white'>
                      <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                        <path d='M7 10l5 5 5-5H7z' />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full md:w-1/4 p-2'>
                <div className='relative inline-block w-64 text-black'>
                  <select
                    name="productModel"
                    className='block appearance-none w-full bg-sky-700 text-xl text-white p-3 rounded leading-tight focus:outline-none focus:shadow-outline'
                  >
                    <option value=''>Select Product Model</option>
                    {productModels.map((model, index) => (
                      <option value={model} key={index}>
                        {model}
                      </option>
                    ))}
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white'>
                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                      <path d='M7 10l5 5 5-5H7z' />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='w-full md:w-1/4 p-2'>
                <div className='relative inline-block w-64 text-black'>
                  <select
                    name="productBrand"
                    className='block appearance-none w-full bg-sky-700 text-xl text-white p-3 rounded leading-tight focus:outline-none focus:shadow-outline'
                  >
                    <option value=''>Select the Product Brand</option>
                    {productBrands.map((brand, index) => (
                      <option value={brand} key={index}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white'>
                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                      <path d='M7 10l5 5 5-5H7z' />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='w-full md:w-1/4 p-2'>
                <div className='relative inline-block w-64 text-black'>
                  <select
                    name="status"
                    className='block appearance-none w-full bg-sky-700 text-xl text-white p-3 rounded leading-tight focus:outline-none focus:shadow-outline'
                  >
                    <option value=''>Select the Status</option>
                    {statuses.map((status, index) => (
                      <option value={status} key={index}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white'>
                    <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                      <path d='M7 10l5 5 5-5H7z' />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='w-full md:w-1/4 p-2 flex justify-center items-center'>
                <div>From Date :</div>
                <div className='px-2'>
                  <input
                    type='date'
                    id='fromDate'
                    name='fromDate'
                    className='bg-sky-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500'
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>
              <div className='w-full md:w-1/4 p-2 flex justify-center items-center'>
                <div>To Date :</div>
                <div className='px-2'>
                  <input
                    type='date'
                    id='toDate'
                    name='toDate'
                    className='bg-sky-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500'
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
              <div className='flex justify-around items-center w-full md:w-1/2 p-2 '>
                <button
                  type="button"
                  className='bg-gray-800 w-40 p-3 text-white text-2xl rounded-2xl '
                  onClick={handleViewClick}
                >
                  View
                </button>
                <div className='p-2'>
                  <button className='bg-gray-800 w-40 p-3 text-white text-2xl rounded-2xl '>Download</button>
                </div>
              </div>
            </form>

            {reportData.length > 0 && (
              <div className='p-5'>
                <table className='min-w-full leading-normal'>
                  <thead>
                    <tr>
                      <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Product Type</th>
                      <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Product Model</th>
                      <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Product Brand</th>
                      <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Status</th>
                      <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((report, index) => (
                      <tr key={index}>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>{report.productType}</td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>{report.productModel}</td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>{report.productBrand}</td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>{report.status}</td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>{new Date(report.createdAt).toLocaleString()}</td>
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

export default StoreReport;
