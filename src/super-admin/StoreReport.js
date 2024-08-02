import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import fetchWithToken from '../services/api';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const productListUrl = `${serverUrl}/products/NEW_getAllProduct`;
const storeReportUrl = `${serverUrl}/products/storeReport`;
const storeReportCSV = `${serverUrl}/products/getStoreReportCSV`;

function StoreReport() {
  const [productData, setProductData] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedProductBrand, setSelectedProductBrand] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [productBrands, setProductBrands] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [productModels, setProductModels] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [reportFetched, setReportFetched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchWithToken(productListUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedProductType(selectedType);
    setSelectedProductBrand('');
    setSelectedProductName('');
    setProductNames([]);
    setProductModels([]);

    if (selectedType) {
      const productTypeData = productData.find(pt => pt.productType === selectedType);
      if (productTypeData) {
        const brands = productTypeData.brands || [];
        setProductBrands(brands.map(brand => brand.productBrand));
      } else {
        setProductBrands([]);
      }
    } else {
      setProductBrands([]);
    }
  };

  const handleProductBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setSelectedProductBrand(selectedBrand);
    setSelectedProductName('');
    setProductModels([]);

    if (selectedBrand && selectedProductType) {
      const productTypeData = productData.find(pt => pt.productType === selectedProductType);
      if (productTypeData) {
        const brandData = productTypeData.brands.find(brand => brand.productBrand === selectedBrand);
        setProductNames(brandData ? brandData.products.map(p => p.productName) : []);
      } else {
        setProductNames([]);
      }
    } else {
      setProductNames([]);
    }
  };

  const handleProductNameChange = (e) => {
    const selectedName = e.target.value;
    setSelectedProductName(selectedName);

    if (selectedName && selectedProductBrand && selectedProductType) {
      const productTypeData = productData.find(pt => pt.productType === selectedProductType);
      if (productTypeData) {
        const brandData = productTypeData.brands.find(brand => brand.productBrand === selectedProductBrand);
        if (brandData) {
          const productData = brandData.products.find(p => p.productName === selectedName);
          setProductModels(productData ? productData.models : []);
        } else {
          setProductModels([]);
        }
      } else {
        setProductModels([]);
      }
    } else {
      setProductModels([]);
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
    const query = {
      productType: selectedProductType,
      productBrand: selectedProductBrand,
      productName: selectedProductName,
      productModel: productModels[0] || '', // Assuming only one model is selected or required
      fromDate,
      toDate
    };

    try {
      const response = await fetchWithToken(storeReportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });
      const data = await response.json();
      setReportData(data);
      setReportFetched(true);
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error('Error fetching report:', error);
      setReportFetched(false);
    }
  };

  const handleDownloadClick = async () => {
    const query = {
      productType: selectedProductType,
      productBrand: selectedProductBrand,
      productName: selectedProductName,
      productModel: productModels[0] || '',
      fromDate,
      toDate
    };

    try {
      const response = await fetch(storeReportCSV, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CSV data');
      }

      const blob = await response.blob();
      const csvData = await blob.text();

      const rows = csvData.split('\n').map(row => {
        const columns = row.split(',');
        if (columns.length >= 5) {
          const [productType, productName, productModel, productBrand, productStatus, createdAt] = columns;
          const formattedDate = createdAt ? formatDate(createdAt.trim()) : '';
          return [productType, productName, productModel, productBrand, productStatus, formattedDate].join(',');
        }
        return '';
      });

      const formattedCsvData = rows.join('\n');
      const formattedBlob = new Blob([formattedCsvData], { type: 'text/csv' });

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentTableData = reportData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(reportData.length / rowsPerPage);

  return (
    <div className='h-screen bg-white'>
      <Navbar />
      <div className='m-4 md:m-10'>
        <div className='flex justify-center items-center text-center text-4xl text-white font-semibold h-24 bg-sky-800'>Store Report</div>
        <div className='bg-sky-300 p-6'>
          <form className='flex flex-wrap gap-4 justify-center'>
            <div className='w-full md:w-1/4'>
              <div className='relative'>
                <select
                  className='block w-full bg-white-700 text-lg text-gray-900 p-3 rounded-lg border border-white-600 focus:outline-none focus:ring-2 focus:ring-white-500'
                  value={selectedProductType}
                  onChange={handleProductTypeChange}
                >
                  <option value=''>Select Product Type</option>
                  {productData.map((typeData, index) => (
                    <option value={typeData.productType} key={index}>
                      {typeData.productType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full md:w-1/4'>
              <div className='relative'>
                <select
                  name="productBrand"
                  className='block w-full bg-white-700 text-lg text-gray-900 p-3 rounded-lg border border-white-600 focus:outline-none focus:ring-2 focus:ring-white-500'
                  value={selectedProductBrand}
                  onChange={handleProductBrandChange}
                  disabled={!selectedProductType}
                >
                  <option value=''>Select Product Brand</option>
                  {productBrands.map((brand, index) => (
                    <option value={brand} key={index}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full md:w-1/4'>
              <div className='relative'>
                <select
                  name="productName"
                  className='block w-full bg-white-700 text-lg text-gray-900 p-3 rounded-lg border border-white-600 focus:outline-none focus:ring-2 focus:ring-white-500'
                  value={selectedProductName}
                  onChange={handleProductNameChange}
                  disabled={!selectedProductBrand}
                >
                  <option value=''>Select Product Name</option>
                  {productNames.map((name, index) => (
                    <option value={name} key={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full md:w-1/4'>
              <div className='relative'>
                <select
                  name="productModel"
                  className='block w-full bg-white-700 text-lg text-gray-900 p-3 rounded-lg border border-white-600 focus:outline-none focus:ring-2 focus:ring-white-500'
                  value={productModels[0] || ''}
                  onChange={(e) => setProductModels([e.target.value])} // Handle single model selection
                  disabled={!selectedProductName}
                >
                  <option value=''>Select Product Model</option>
                  {productModels.map((model, index) => (
                    <option value={model} key={index}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full md:w-1/4'>
              <input
                type='date'
                className='block w-full bg-white-700 text-lg text-gray-900 p-3 rounded-lg border border-white-600 focus:outline-none focus:ring-2 focus:ring-white-500'
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className='w-full md:w-1/4'>
              <input
                type='date'
                className='block w-full bg-white-700 text-lg text-gray-900 p-3 rounded-lg border border-white-600 focus:outline-none focus:ring-2 focus:ring-white-500'
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className='w-full flex justify-center mt-4'>
              <button
                type='button'
                className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
                onClick={handleViewClick}
              >
                View Report
              </button>
            </div>
            {/* <div className='w-full flex justify-center mt-4'>
              <button
                type='button'
                className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'
                onClick={handleDownloadClick}
              >
                Download CSV
              </button>
            </div> */}
          </form>
          {reportFetched && (
            <div className='mt-6'>
              <table className='min-w-full bg-white border border-black'>
                <thead>
                  <tr>
                    <th className='py-2 px-4 border border-black text-start'>Product Type</th>
                    <th className='py-2 px-4 border border-black text-start'>Product Name</th>
                    <th className='py-2 px-4 border border-black text-start'>Product Model</th>
                    <th className='py-2 px-4 border border-black text-start'>Product Brand</th>
                    <th className='py-2 px-4 border border-black text-start'>Status</th>
                    <th className='py-2 px-4 border border-black text-start'>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData.map((item, index) => (
                    <tr key={index}>
                      <td className='py-2 px-4 border border-black'>{item.productType}</td>
                      <td className='py-2 px-4 border border-black'>{item.productName}</td>
                      <td className='py-2 px-4 border border-black'>{item.productModel}</td>
                      <td className='py-2 px-4 border border-black'>{item.productBrand}</td>
                      <td className='py-2 px-4 border border-black'>{item.status}</td>
                      <td className='py-2 px-4 border border-black'>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='flex justify-center mt-4'>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`mx-1 px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoreReport;
