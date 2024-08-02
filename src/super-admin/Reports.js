import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function Reports() {
  return (
    <div className='bg-sky-100 min-h-screen flex flex-col'>
      <Navbar />
      <div className='p-8 md:p-12 flex flex-col items-center '>
        <div className='w-full bg-sky-300'>
          <div className='text-center  font-semibold text-4xl bg-sky-800  h-24 flex justify-center items-center text-white'>
            Reports
          </div>
          <div className='m-5 md:m-20'>
          <div className='flex flex-col  md:flex-row gap-4 md:gap-20'>
            <Link to='/reports/store-reports' className='w-full md:w-1/2'>
              <div className='bg-sky-700 h-40 flex items-center justify-center text-white text-2xl font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors duration-300 whitespace-nowrap'>
                Store Report
              </div>
            </Link>
            <Link to='/reports/issue-report' className='w-full md:w-1/2'>
              <div className='bg-sky-700 h-40 flex items-center justify-center text-white text-2xl font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors duration-300 whitespace-nowrap'>
                Issue Report
              </div>
            </Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
