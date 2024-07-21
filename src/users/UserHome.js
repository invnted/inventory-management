import React from 'react';
import Navbar from '../components/Navbar';
import UserNavbar from '../components/UserNavbar';
import RaiseDemand from '../Images/raise.png';
import ProductReceived from '../Images/product-received.png';
import ProductInUse from '../Images/product-in-use.png';
import { Link } from 'react-router-dom';

function UserHome() {
    return (
        <div className='bg-sky-300 min-h-screen'>
            <UserNavbar />
            <div className="flex flex-col md:flex-row flex-wrap gap-20 p-5 justify-center items-center md:m-32">
                <Link to='/user-home/raise-demand'>
                    <div className='w-72 h-40 bg-sky-800 hover:bg-sky-500 transition duration-300 flex justify-center items-center rounded-3xl cursor-pointer shadow-2xl'>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='w-16'>
                                <img src={RaiseDemand} alt="Raise Demand" />
                            </div>
                            <div className='text-3xl text-white'>Raise Demand</div>
                        </div>
                    </div>
                </Link>
                <Link to='/user-home/product-received'>
                    <div className='w-72 h-40 bg-sky-800 hover:bg-sky-500 transition duration-300 flex justify-center items-center rounded-3xl cursor-pointer shadow-2xl'>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='w-16'>
                                <img src={ProductReceived} alt="Product Received" />
                            </div>
                            <div className='text-3xl text-white'>Product Received</div>
                        </div>
                    </div>
                </Link>
                <div className='w-72 h-40 bg-sky-800 hover:bg-sky-500 transition duration-300 flex justify-center items-center rounded-3xl cursor-pointer shadow-2xl'>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='w-16'>
                            <img src={ProductInUse} alt="Product in Use" />
                        </div>
                        <div className='text-3xl text-white'>Product in Use</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserHome;
