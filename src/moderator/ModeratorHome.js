import React from 'react'
import ModeratorNavbar from './ModeratorNavbar'
import Issue from '../Images/issue.png'
import Pending from '../Images/clock1.png'
import { Link } from 'react-router-dom'

function ModeratorHome() {
  return (
    <div className='bg-sky-300 h-screen'>
      <ModeratorNavbar />
      <div className='m-20 justify-between'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 m-auto">
                <Link to='/moderator-home/issue-product'>
                    <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer rounded-2xl">
                        <div className='w-20 block'>
                            <img className='color-white' src={Issue} alt="Description" />
                        </div>
                        <div className='p-2 text-white text-3xl font-mono'>
                            Issue Product
                        </div>
                    </div>
                </Link>

                <Link to=''>
                    <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer rounded-2xl">
                        <div className='w-20 block'>
                            <img className='color-white' src={Pending} alt="Description" />
                        </div>
                        <div className='p-2 text-white text-3xl font-mono'>
                            Pending
                        </div>
                    </div>
                </Link>
                

                


            </div>
        </div >
    </div>
  )
}

export default ModeratorHome