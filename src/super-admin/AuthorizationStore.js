import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Chart from 'react-apexcharts';
import fetchWithToken from '../services/api';
import { toast } from 'react-toastify';

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
        const response = await fetchWithToken(productTypeListUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok){
        const data = await response.json();
        setProductTypes(data);
        }

        else
        {
          toast.error("Fail to fetch data");
        }

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
      const response = await fetchWithToken(productStoreDetailUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productType: selectedProductType }),
      });

      if (response.ok)
      {

      const data = await response.json();
      console.log('Fetched product store details:', data);

      toast.success("Successfully Fetched");

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
      }

      else
      {
        toast.error("Fail to fetch")
      }
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
    <div className='bg-sky-400 min-h-screen'>
      <Navbar />
      <div className='flex flex-col items-center'>
        <form className='flex flex-col md:flex-row justify-center items-center gap-5 pt-5' onSubmit={handleSubmit}>
          <select
            id='productTypes'
            className='text-xl md:text-2xl font-bold rounded-xl outline-none block p-3 bg-sky-700 dark:text-white w-72 md:w-80 cursor-pointer hover:bg-sky-900 delay-100'
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
            className='p-3 md:p-4 bg-sky-700 w-28 md:w-32 flex justify-center items-center text-lg md:text-xl font-bold text-white rounded-xl cursor-pointer hover:bg-sky-900 delay-100'
          >
            Submit
          </button>
        </form>
        {chartData.series.length > 0 && (
          <div className='flex flex-col md:flex-row justify-around items-center w-full bg-sky-400 mt-5'>
            <Chart
              className='w-11/12 md:w-1/2 lg:w-1/3 mb-5 md:mb-0'
              type='pie'
              series={chartData.series}
              options={chartData.options}
            />
            <div className='flex flex-col w-11/12 md:w-1/2 lg:w-1/3 p-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='text-center bg-sky-700 p-5 rounded-xl text-lg md:text-xl font-bold text-white'>
                  <div>Issued</div>
                  <div>{chartData.series[4]}</div>
                </div>
                <div className='text-center bg-sky-700 p-5 rounded-xl text-lg md:text-xl font-bold text-white'>
                  <div>Held</div>
                  <div>{chartData.series[1]}</div>
                </div>
                <div className='text-center bg-sky-700 p-5 rounded-xl text-lg md:text-xl font-bold text-white'>
                  <div>Serviceable</div>
                  <div>{chartData.series[3]}</div>
                </div>
                <div className='text-center bg-sky-700 p-5 rounded-xl text-lg md:text-xl font-bold text-white'>
                  <div>Unserviceable</div>
                  <div>{chartData.series[2]}</div>
                </div>
                <div className='text-center bg-sky-700 p-5 rounded-xl text-lg md:text-xl font-bold text-white'>
                  <div>BER</div>
                  <div>{chartData.series[0]}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorizationStore;
