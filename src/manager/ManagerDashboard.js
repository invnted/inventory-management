import React, { useEffect, useState } from 'react';
import ManagerNavbar from './ManagerNavbar';
import Store from '../Images/store1.png';
import AddProduct from '../Images/category.png';
import AddUser from '../Images/add1.png';
import Demand from '../Images/demand.png';
import OutOfStock from '../Images/OutOfStock.png';
import ProductReport from '../Images/ProductReport.png';
import { Link } from 'react-router-dom';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const GET_OUT_OF_STOCK_URL = `${serverUrl}/products/getOutOfStock`;

function ManagerDashboard() {
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const [demandReceivedPermission, setDemandReceivedPermission] = useState(false);
  const [allProductReportPermission, setAllProductReportPermission] = useState(true); // Default to true, will be overridden by local storage value

  useEffect(() => {
    const fetchOutOfStockItems = async () => {
      try {
        const response = await fetch(GET_OUT_OF_STOCK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setShowNotificationDot(data.makeNotification);
      } catch (error) {
        console.error('Failed to fetch out-of-stock items:', error);
      }
    };

    fetchOutOfStockItems();
  }, []);

  useEffect(() => {
    // Get permissions value from local storage
    const demandReceived = localStorage.getItem('demandReceived');
    setDemandReceivedPermission(demandReceived === 'true');
    
    const allProductReport = localStorage.getItem('allProductReport');
    setAllProductReportPermission(allProductReport === 'true');
  }, []);

  return (
    <div>
      <ManagerNavbar />
      <div className='m-20 justify-between'>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 m-auto">
          <Link to='/moderator-home/authorization-store'>
            <div className="bg-sky-800 p-4 h-44 flex flex-col justify-center items-center cursor-pointer rounded-lg">
              <div className='w-20 flex justify-center items-center'>
                <img className='color-white' src={Store} alt="Description" />
              </div>
              <div className='p-2 text-white text-xl font-semibold text-center'>
                <h2>Authorization Store</h2>
              </div>
            </div>
          </Link>
          <Link to='/manager-dashboard/manager-AddProduct'>
            <div className="bg-sky-800 p-4 h-44 flex flex-col justify-center items-center cursor-pointer rounded-lg">
              <div className='w-20 flex justify-center items-center'>
                <img className='color-white' src={AddProduct} alt="Description" />
              </div>
              <div className='p-2 text-white text-xl font-semibold text-center'>
                <h2>Add Product</h2>
              </div>
            </div>
          </Link>
          {allProductReportPermission && (
            <Link to='/manager-dashboard/manager-ProductReport'>
              <div className="bg-sky-800 p-4 h-44 flex flex-col justify-center items-center cursor-pointer rounded-lg">
                <div className='w-20 flex justify-center items-center'>
                  <img className='color-white' src={ProductReport} alt="Description" />
                </div>
                <div className='p-2 text-white text-xl font-semibold text-center'>
                  <h2>Product Report</h2>
                </div>
              </div>
            </Link>
          )}
          <Link to='/manager-dashboard/managerAdd-user'>
            <div className="bg-sky-800 p-4 h-44 flex flex-col justify-center items-center cursor-pointer rounded-lg">
              <div className='w-20 flex justify-center items-center'>
                <img className='color-white' src={AddUser} alt="Description" />
              </div>
              <div className='p-2 text-white text-xl font-semibold text-center'>
                <h2>Add User</h2>
              </div>
            </div>
          </Link>
          {demandReceivedPermission && (
            <>
              <Link to='/manager-dashboard/ManagerDemand'>
                <div className="bg-sky-800 p-4 h-44 flex flex-col justify-center items-center cursor-pointer rounded-lg">
                  <div className='w-20 flex justify-center items-center'>
                    <img className='color-white' src={Demand} alt="Description" />
                  </div>
                  <div className='p-2 text-white text-xl font-semibold text-center'>
                    User Demand
                  </div>
                </div>
              </Link>
              <Link to='/manager-dashboard/CompanyDemand'>
                <div className="bg-sky-800 p-4 h-44 flex flex-col justify-center items-center cursor-pointer rounded-lg">
                  <div className='w-20 flex justify-center items-center'>
                    <img className='color-white' src={Demand} alt="Description" />
                  </div>
                  <div className='p-2 text-white text-xl font-semibold text-center'>
                    Company Demand
                  </div>
                </div>
              </Link>
            </>
          )}
          <Link to='/manager-dashboard/StockRequiredInStore'>
            <div className="bg-sky-800 p-4 h-44 flex flex-col justify-center items-center cursor-pointer rounded-lg">
              <div className='w-20 flex justify-center items-center'>
                <img className='color-white' src={OutOfStock} alt="Description" />
              </div>
              <div className='p-2 text-white text-xl font-semibold text-center'>
                <h2>Stock Required
                  {showNotificationDot && (
                    <span className="absolute h-3 w-3 bg-yellow-300 rounded-full"></span>
                  )}
                </h2>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;