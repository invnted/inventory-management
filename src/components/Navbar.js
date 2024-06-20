// import React from 'react'
// import { Link } from 'react-router-dom'
// import Search from './Search'
// import ProfilePhoto from '../Images/profile photo.jpg'




// function Navbar() {
//     return (
//         <div>


//             <nav className="bg-white border-gray-200 dark:bg-gray-900">
//                 <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

//                         <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">Super Admin Dashboard</span>
//                     <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
//                         <Link to='/home/logout' type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
//                             <img className="w-8 h-8 rounded-full" src={ProfilePhoto} />
//                         </Link>

//                     </div>
//                     <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
//                         <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//                             <li>
//                                 <a href="#" className="block py-2 px-3 text-white bg-blue-700  rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Dashboard</a>
//                             </li>
//                             <li>
//                                 <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Reports</a>
//                             </li>



//                         </ul>
//                     </div>
//                 </div>
//             </nav>

//         </div>
//     )
// }

// export default Navbar


import React from 'react'
import { Link } from 'react-router-dom'
import Search from './Search'
import ProfilePhoto from '../Images/profile photo.jpg'
import { useLocation } from 'react-router-dom';




function Navbar() {
    // const location = useLocation();
    // const { username, email, department, profileId, role } = location.state || {};
    return (
        <div>

            {/* <h1>Username: {username}</h1>
            <h1>Email: {email}</h1>
            <h1>Department: {department}</h1>
            <h1>Profile ID: {profileId}</h1>
            <h1>Role: {role}</h1> */}

            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

                    <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">Super Admin Dashboard</span>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <Link to='/home/logout' type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                            <img className="w-8 h-8 rounded-full" src={ProfilePhoto} />
                        </Link>

                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <Link to='/home' href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Dashboard</Link>
                            </li>
                            <li>
                                <Link to='/reports' href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Reports</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default Navbar