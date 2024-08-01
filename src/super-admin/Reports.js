import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function Reports() {
  return (
    <div className='bg-sky-100 min-h-screen flex flex-col'>
      <Navbar />
      <div className='p-8 md:p-12 flex flex-col items-center'>
        <header className='text-center text-black font-bold text-4xl py-12 px-8'>
          Reports
        </header>
        <div className='flex flex-col md:flex-row gap-6 md:gap-8'>
          <Link to='/reports/store-reports' className='w-full md:w-1/2'>
            <div className='bg-sky-700 p-6 flex items-center justify-center text-white text-2xl font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors duration-300 whitespace-nowrap'>
              Store Report
            </div>
          </Link>
          <Link to='/reports/issue-reports' className='w-full md:w-1/2'>
            <div className='bg-sky-700 p-6 flex items-center justify-center text-white text-2xl font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors duration-300 whitespace-nowrap'>
              Issue Report
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Reports;
