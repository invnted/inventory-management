import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

function Reports() {
  return (
    <div>
      <Navbar />
      <div className='m-4 md:m-12 border border-black justify-between'>
        <div className='text-center bg-gray-800 text-white text-5xl h-24 flex items-center justify-center '>
          <div>Reports</div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 m-20 '>
          <Link to='/reports/store-reports'>
            <div className='bg-gray-700 p-4 h-32 flex flex-col text-white text-3xl justify-center items-center cursor-pointer'>Store Report</div>
          </Link>
          <div className='bg-gray-400 p-4 h-32 flex flex-col text-black text-3xl justify-center items-center cursor-pointer'>Issue Report</div>
          <div className='bg-gray-700 p-4 h-32 flex flex-col text-white text-3xl justify-center items-center cursor-pointer'>Demand Report</div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 mx-20 '>
          <div className='bg-gray-400 p-4 h-32 flex flex-col text-black text-3xl justify-center items-center cursor-pointer'>All User Report</div>
          <div className='bg-gray-700 p-4 h-32 flex flex-col text-white text-3xl justify-center items-center cursor-pointer'>All Admin Report</div>
        </div>
      </div>

    </div>
  )
}

export default Reports