import React from 'react'
import { useEffect, useRef } from 'react';

function ManagerLogin() {

    return (
        <div className='relative h-auto'>
            
            <div className='absolute inset-0  bg-black  bg-opacity-60 backdrop-blur-md flex items-center justify-center'>
                <div className="w-4/5 md:w-1/4 border  rounded-lg shadow p-5">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-3xl dark:text-white">
                           Manager Login
                        </h1>
                        <form className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="w-full bg-transparent border-b border-gray-300  px-4 py-2 focus:outline-none text-white" placeholder="name@company.com"  required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="w-full bg-transparent border-b border-gray-300  px-4 py-2 focus:outline-none text-white  mb-6" required />
                            </div>
                            <div className='mt-20 flex justify-center items-center'>
                                <button type="submit" className="w-1/2 flex justify-center items-center hover:bg-gray-500 hover:text-black text-xl font-bold text-white border p-3 rounded-xl">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerLogin