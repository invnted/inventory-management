import React from 'react'
import Navbar from '../components/Navbar'
import UserNavbar from '../components/UserNavbar'
import RaiseDemand from '../Images/raise.png'
import ProductReceived from '../Images/product-received.png'
import ProductInUse from '../Images/product-in-use.png'
import { Link } from 'react-router-dom'
import CompanyNavbar from './CompanyNavbar'

function CompanyDashboard() {
    return (
        <div className='bg-sky-300 h-screen'>
            <CompanyNavbar/>


            <div class="flex flex-col md:flex-row gap-10 p-5 justify-between items-center md:m-40">
                <Link to='/company-home/raise-demand'>
                    <div className='w-72  h-40 bg-sky-800 hover:bg-sky-500 delay-100  flex justify-center items-center rounded-3xl cursor-pointer shadow-2xl'>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='w-16'> <img src={RaiseDemand} /> </div>
                            <div className='text-3xl text-white'>Raise Demand</div>
                        </div>
                    </div>
                </Link>
                <Link to='/company-home/product-received'>
                <div className='w-72  h-40 bg-sky-800 hover:bg-sky-500 delay-100 flex justify-center items-center rounded-3xl cursor-pointer shadow-2xl'>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='w-16'> <img src={ProductReceived} /> </div>
                        <div className='text-3xl text-white'>Product Received</div>
                    </div>
                </div>
                </Link>
                <div className='w-72  h-40 bg-sky-800 hover:bg-sky-500 delay-100 flex justify-center items-center rounded-3xl cursor-pointer shadow-2xl'>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='w-16'> <img src={ProductInUse} /> </div>
                        <div className='text-3xl text-white' >Product in Use</div>
                    </div>
                </div>


            </div>
        </div >

    )
}


export default CompanyDashboard