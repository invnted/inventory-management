import React from 'react'
import AddCategory from '../Images/category.png'
import AddManager from '../Images/add1.png'
import ListManager from '../Images/list.png'
import AddUser from '../Images/add manager.png'
import Store from '../Images/store1.png'
import DemandRequesr from '../Images/demand.png'
import PendingDemand from '../Images/clock1.png'
import { Link } from 'react-router-dom'


function DashBoard() {

    return (

        <div className='m-20 justify-between'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 m-auto">
                <Link to='/home/add-category'>
                    <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer">
                        <div className='w-20 block'>
                            <img className='color-white' src={AddCategory} alt="Description" />
                        </div>
                        <div className='p-2 text-white'>
                            <h2>Add Category</h2>
                        </div>
                    </div>
                </Link>
                <Link to='/home/add-manager'>
                    <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer">
                        <div className='w-20 block'>
                            <img src={AddManager} alt="Description" />
                        </div>
                        <div className='p-2'>
                            <h2 className='text-white'>Add Manager</h2>
                        </div>
                    </div>
                </Link>
                <Link to='/home/add-user'>
                    <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer">
                        <div className='w-20 block'>
                            <img src={AddUser} alt="Description" />
                        </div>
                        <div className='p-2 text-white'>
                            <h2>Add User</h2>
                        </div>
                    </div>
                </Link>
                <Link to='/home/authorization-store'>
                    <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer">
                        <div className='w-20 block'>
                            <img src={Store} alt="Description" />
                        </div>
                        <div className='p-2'>
                            <h2 className='text-white'>Authorization Store</h2>
                        </div>
                    </div>
                </Link>
                <Link to='/home/demand-request'>
                    <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer">
                        <div className='w-20 block'>
                            <img src={DemandRequesr} alt="Description" />
                        </div>
                        <div className='p-2 text-white'>
                            <h2>Demand Requested</h2>
                        </div>
                    </div>
                </Link>
                <Link to='/home/pending-demand'>
                    <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer">
                        <div className='w-20 block'>
                            <img src={PendingDemand} alt="Description" />
                        </div>
                        <div className='p-2'>
                            <h2 className='text-white'>Pending Demand</h2>
                        </div>
                    </div>
                </Link>


            </div>
        </div >
    )
}

export default DashBoard