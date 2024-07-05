import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Chart from 'react-apexcharts';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const productTypeListUrl = `${serverUrl}/products/productType-list`;
const productStoreDetailUrl = `${serverUrl}/products/getProductStore`;

function AuthorizationStore() {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      labels: ['BER', 'HELD', 'UNSERVICEABLE', 'SERVICEABLE', 'ISSUED'],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
              },
              value: {
                show: true,
              },
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch(productTypeListUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched product types:', data);
        setProductTypes(data);
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    };

    fetchProductTypes();
  }, []);

  const handleProductTypeChange = (event) => {
    setSelectedProductType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(productStoreDetailUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productType: selectedProductType }),
      });
      const data = await response.json();
      console.log('Fetched product store details:', data);

      const seriesData = [
        parseInt(data.BER),
        parseInt(data.HELD),
        parseInt(data.UNSERVICEABLE),
        parseInt(data.SERVICEABLE),
        parseInt(data.ISSUED),
      ];

      setChartData({
        series: seriesData,
        options: chartData.options,
      });
    } catch (error) {
      console.error('Error fetching product store details:', error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className='bg-sky-400 h-screen'>
      <Navbar />
      <form
        className='flex justify-center items-center gap-5 pt-5'
        onSubmit={handleSubmit}
      >
        <select
          id='productTypes'
          className='text-2xl font-bold rounded-xl outline-none block p-3 bg-sky-700 dark:text-white w-72 cursor-pointer hover:bg-sky-900 delay-100'
          onChange={handleProductTypeChange}
          value={selectedProductType}
        >
          <option value=''>Select Product Type</option>
          {productTypes.map((productType, index) => (
            <option
              value={productType}
              key={index}
              className='bg-sky-700 delay-100 h-20 flex text-white justify-center items-center rounded-xl font-bold cursor-pointer'
            >
              {productType}
            </option>
          ))}
        </select>
        <button
          type='submit'
          className='p-4 bg-sky-700 w-28 flex justify-center items-center text-xl font-bold text-white rounded-xl cursor-pointer hover:bg-sky-900 delay-100'
        >
          Submit
        </button>
      </form>
      {chartData.series.length > 0 && ( // Conditionally render when chartData.series has values
        <div className='flex justify-around items-center h-screen bg-sky-400'>
          <Chart
            className='w-2/3 md:w-1/2 lg:w-1/3 h-3/4 '
            type='pie'
            series={chartData.series}
            options={chartData.options}
          />
          <div className='h-3/4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 m-10 justify-center items-center'>
              <div className='text-center bg-sky-700 p-5 rounded-xl text-xl font-bold text-white'>
                <div>Issued</div>
                <div>{chartData.series[4]}</div>
              </div>
              <div className='text-center bg-sky-700 p-5 rounded-xl text-xl font-bold text-white'>
                <div>Held</div>
                <div>{chartData.series[1]}</div>
              </div>
              <div className='text-center bg-sky-700 p-5 rounded-xl text-xl font-bold text-white'>
                <div>Serviceable</div>
                <div>{chartData.series[3]}</div>
              </div>
              <div className='text-center bg-sky-700 p-5 rounded-xl text-xl font-bold text-white'>
                <div>Unserviceable</div>
                <div>{chartData.series[2]}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthorizationStore;
