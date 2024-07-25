import React from 'react';
import ModeratorNavbar from './ModeratorNavbar';
import Issue from '../Images/issue.png';
import Ticket from '../Images/RaiseTicket.png';
import { Link } from 'react-router-dom';

function ModeratorHome() {
  return (
    <div className='min-h-screen bg-sky-300'>
      <ModeratorNavbar />
      <div className='p-4 md:p-20 flex justify-center items-center'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 m-auto">
          <Link to='/moderator-home/issue-product'>
            <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer rounded-2xl">
              <div className='w-20'>
                <img className='w-full' src={Issue} alt="Issue for User" />
              </div>
              <div className='p-4 text-white text-xl font-mono text-center'>
                Issue For User
              </div>
            </div>
          </Link>

          <Link to='/moderator-home/issue-product-company'>
            <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer rounded-2xl">
              <div className='w-20'>
                <img className='w-full' src={Issue} alt="Issue for Company" />
              </div>
              <div className='p-4 text-white text-xl font-mono text-center'>
                Issue For Company
              </div>
            </div>
          </Link>

          <Link to='/moderator-home/user-ticket-received'>
            <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer rounded-2xl">
              <div className='w-20'>
                <img className='w-full' src={Ticket} alt="User Ticket Received" />
              </div>
              <div className='p-4 text-white text-xl font-mono text-center'>
                User Ticket Received
              </div>
            </div>
          </Link>

          <Link to='/moderator-home/company-ticket-received'>
            <div className="bg-sky-800 p-4 h-52 flex flex-col justify-center items-center cursor-pointer rounded-2xl">
              <div className='w-20'>
                <img className='w-full' src={Ticket} alt="Company Ticket Received" />
              </div>
              <div className='p-4 text-white text-xl font-mono text-center'>
                Company Ticket Received
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ModeratorHome;
