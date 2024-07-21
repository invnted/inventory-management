import React from 'react';
import { Link } from 'react-router-dom';
import RaiseDemand from '../Images/raise.png';
import ProductReceived from '../Images/product-received.png';
import ProductInUse from '../Images/product-in-use.png';
import CompanyNavbar from './CompanyNavbar';

function CompanyDashboard() {
    return (
        <div className='bg-sky-300 min-h-screen'>
            <CompanyNavbar />
            <div className='flex flex-col md:flex-row gap-6 md:gap-20 p-5 md:p-10 justify-center items-center md:m-28'>
                <Link to='/company-home/raise-demand'>
                    <div className='w-72 h-40 bg-sky-800 hover:bg-sky-500 transition-colors duration-300 flex justify-center items-center rounded-3xl cursor-pointer shadow-2xl'>
                        <div className='flex flex-col justify-center items-center'>
                            <img src={RaiseDemand} className='w-16 h-16' alt='Raise Demand' />
                            <div className='text-lg md:text-2xl lg:text-3xl text-white'>Raise Demand</div>
                        </div>
                    </div>
                </Link>
                <Link to='/company-home/product-received'>
                    <div className='w-72 h-40 bg-sky-800 hover:bg-sky-500 transition-colors duration-300 flex justify-center items-center rounded-3xl cursor-pointer shadow-2xl'>
                        <div className='flex flex-col justify-center items-center'>
                            <img src={ProductReceived} className='w-16 h-16' alt='Product Received' />
                            <div className='text-lg md:text-2xl lg:text-3xl text-white'>Product Received</div>
                        </div>
                    </div>
                </Link>
                <div className='w-72 h-40 bg-sky-800 hover:bg-sky-500 transition-colors duration-300 flex justify-center items-center rounded-3xl cursor-pointer shadow-2xl'>
                    <div className='flex flex-col justify-center items-center'>
                        <img src={ProductInUse} className='w-16 h-16' alt='Product in Use' />
                        <div className='text-lg md:text-2xl lg:text-3xl text-white'>Product in Use</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDashboard;
