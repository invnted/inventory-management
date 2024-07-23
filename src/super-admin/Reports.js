import React from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

function Reports() {
  return (
    <div>
      <Navbar />
      <div className='m-4 md:m-12 border  justify-between bg-sky-200'>
        <div className='text-center bg-sky-800 text-white text-5xl h-24 flex items-center justify-center '>
          <div>Reports</div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 m-20 '>
          <Link to='/reports/store-reports'>
            <div className='bg-sky-800 p-4 h-32 flex flex-col text-white text-3xl justify-center items-center cursor-pointer'>Store Report</div>
          </Link>
          <div className='bg-sky-800 p-4 h-32 flex flex-col text-white text-3xl justify-center items-center cursor-pointer'>Issue Report</div>
          <Link to='/home/demand-report'>
            <div className='bg-sky-800 p-4 h-32 flex flex-col text-white text-3xl justify-center items-center cursor-pointer'>Demand Report</div>
          </Link>

        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 mx-20 '>
          <div className='bg-sky-800 p-4 h-32 flex flex-col text-white text-3xl justify-center items-center cursor-pointer'>All User Report</div>
          <Link to='/reports/manager-report'>
            <div className='bg-sky-800 p-4 h-32 flex flex-col text-white text-3xl justify-center items-center cursor-pointer'>All Manager Report</div>
          </Link>

        </div>
      </div>

    </div>
  )
}

export default Reports