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

  return (
    <div className='h-screen bg-sky-600'>
      <Navbar />
      <div className='p-4'>
        <div className='bg-sky-500 rounded-lg shadow-lg p-6'>
          <div className='text-center text-3xl font-bold text-white mb-6'>Store Report</div>
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
            <div className='w-full flex justify-center mt-4'>
              <button
                type='button'
                className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'
                onClick={handleDownloadClick}
              >
                Download CSV
              </button>
            </div>
          </form>
          {reportFetched && (
            <div className='mt-6'>
              <table className='min-w-full bg-white border border-gray-200'>
                <thead>
                  <tr>
                    <th className='py-2 px-4 border-b'>Product Type</th>
                    <th className='py-2 px-4 border-b'>Product Name</th>
                    <th className='py-2 px-4 border-b'>Product Model</th>
                    <th className='py-2 px-4 border-b'>Product Brand</th>
                    <th className='py-2 px-4 border-b'>Status</th>
                    <th className='py-2 px-4 border-b'>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td className='py-2 px-4 border-b'>{item.productType}</td>
                      <td className='py-2 px-4 border-b'>{item.productName}</td>
                      <td className='py-2 px-4 border-b'>{item.productModel}</td>
                      <td className='py-2 px-4 border-b'>{item.productBrand}</td>
                      <td className='py-2 px-4 border-b'>{item.status}</td>
                      <td className='py-2 px-4 border-b'>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoreReport;
