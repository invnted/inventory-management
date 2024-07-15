import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const productListUrl = `${serverUrl}/products/getAllProduct`;
const storeReportUrl = `${serverUrl}/products/storeReport`;
const storeReportCSV = `${serverUrl}/products/getStoreReportCSV`;

function StoreReport() {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [productModels, setProductModels] = useState([]);
  const [productBrands, setProductBrands] = useState([]);
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

      console.log("Selected type:",selectedType)

    } else {
      setProductModels([]);
      setProductBrands([]);
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  const handleViewClick = async () => {
    const productModelElement = document.querySelector('select[name="productModel"]');
    const productBrandElement = document.querySelector('select[name="productBrand"]');

    const query = {
      productType: selectedProductType,
      productModel: productModelElement ? productModelElement.value : '',
      productBrand: productBrandElement ? productBrandElement.value : '',
      fromDate,
      toDate
    };

    console.log("Query :",query)

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
 

  const handleDownloadClick = async () => {
    const productModelElement = document.querySelector('select[name="productModel"]');
    const productBrandElement = document.querySelector('select[name="productBrand"]');
  
    const query = {
      productType: selectedProductType,
      productModel: productModelElement ? productModelElement.value : '',
      productBrand: productBrandElement ? productBrandElement.value : '',
      fromDate,
      toDate
    };
  
    console.log('Download Query:', query); // Ensure selectedProductType is correctly set
  
    try {
      const response = await fetch(storeReportCSV, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });
  
      const blob = await response.blob();
      const csvData = await blob.text();
  
      console.log('Raw CSV Data:', csvData);
  
      const rows = csvData.split('\n').map(row => {
        const columns = row.split(',');
        if (columns.length >= 5) {
          const [productType, productModel, productBrand, productStatus, createdAt] = columns;
          const formattedDate = createdAt ? formatDate(createdAt.trim()) : ''; // Check if createdAt is defined before calling trim
          return [productType, productModel, productBrand, productStatus, createdAt].join(',');
        }
        return ''; // Handle incomplete rows if necessary
      });
  
      const formattedCsvData = rows.join('\n');
      const formattedBlob = new Blob([formattedCsvData], { type: 'text/csv' });
  
      console.log("After Processing: ", formattedCsvData);
  
      const url = window.URL.createObjectURL(formattedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'store_report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };
  
  
  

  return (
    <div className='h-cover'>
      <Navbar />
      <div className=''>
        <div className=' inset-0 m-20'>
          <div className='bg-sky-300'>
            <div className='flex justify-center items-center bg-sky-800 p-8 tex-bold text-white  text-4xl'>Store Report</div>
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
                    <option value=''>Select Product Brand</option>
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
                <input
                  type='date'
                  className='appearance-none block w-full bg-sky-700 text-xl text-white p-3 rounded leading-tight focus:outline-none focus:shadow-outline'
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className='w-full md:w-1/4 p-2'>
                <input
                  type='date'
                  className='appearance-none block w-full bg-sky-700 text-xl text-white p-3 rounded leading-tight focus:outline-none focus:shadow-outline'
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className='w-full md:w-1/4 p-2'>
                <button
                  type='button'
                  className='w-full bg-sky-700 text-xl text-white p-3 rounded leading-tight focus:outline-none focus:shadow-outline'
                  onClick={handleViewClick}
                >
                  View Report
                </button>
              </div>
              <div className='w-full md:w-1/4 p-2'>
                <button
                  type='button'
                  className='w-full bg-sky-700 text-xl text-white p-3 rounded leading-tight focus:outline-none focus:shadow-outline'
                  onClick={handleDownloadClick}
                >
                  Download CSV
                </button>
              </div>
            </form>
            <div className='overflow-auto bg-white text-black p-10'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Product Type
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Product Model
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Product Brand
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {reportData.map((report, index) => (
                    <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{report.productType}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{report.productModel}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{report.productBrand}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{formatDate(report.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreReport;
