import React from 'react'
import Bg from '../Images/bg1.jpg'
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Admin from '../Images/admin.png'
import Manager from '../Images/manager.png'
import User from '../Images/user.png'


function LoginOption() {

    return (
        <div className='relative w-screen h-screen'>
            <img
                src={Bg}
                className='w-screen h-screen object-cover' />
            <div className='absolute inset-0  bg-black text-white bg-opacity-60 backdrop-blur-md'>
                <h1 className='text-2xl md:text-5xl font-bold text-white m-10 text-center md:mt-36 flex justify-center items-center'>Please Select Your Role</h1>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10 mx-6 md:m-40 '>
                    <Link to='/login'>
                        <div className='border-2  border-sky-600 rounded-xl p-6 md:p-10 text-2xl md:text-4xl font-semibold text-sky-600 cursor-pointer flex flex-col justify-center items-center'>
                            <div className='w-20'><img src={Admin}/></div>
                            <div>Super Admin</div>
                        </div>
                    </Link>
                    <Link to='/manager-login'>
                        <div className='border-2 rounded-xl border-green-600 p-10 text-4xl font-semibold text-green-500 cursor-pointer flex flex-col justify-center items-center'>
                            <div className='w-20'><img src={Manager}/></div>
                            <div>Manager</div>
                        </div>
                    </Link>
                    <Link to='/user-login'>
                        <div className='border-2 rounded-xl p-10 border-purple-600 text-4xl font-semibold text-purple-600 cursor-pointer flex flex-col justify-center items-center'>
                            <div className='w-20'><img src={User}/></div>
                            <div>User</div>
                        </div>
                    </Link>

                </div>


            </div>
        </div>
    )
}

export default LoginOption