import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bg from '../Images/bg1.jpg';
import { toast } from 'react-toastify';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const LOGIN_URL = `${serverUrl}/managers/manager-login`;

function ManagerLogin() {
  const [manager, setManager] = useState({
    managerId: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setManager({
      ...manager,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manager),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Received:', data);

        const {
          token,
          manager: {
            managerId,
            managerName,
            designation,
            section,
            appointment,
            allProductReport,
            demandReceived,
            issueProduct,
          },
        } = data;

        localStorage.setItem('managerId', managerId);
        localStorage.setItem('managerName', managerName);
        localStorage.setItem('designation', designation);
        localStorage.setItem('section', section);
        localStorage.setItem('appointment', appointment);
        localStorage.setItem('allProductReport', allProductReport);
        localStorage.setItem('demandReceived', demandReceived);
        localStorage.setItem('issueProduct', issueProduct);
        localStorage.setItem('token', token);

        console.log('ManagerId:', managerId);
        console.log('ManagerName:', managerName);
        console.log('Designation:', designation);
        console.log('Section:', section);
        console.log('Appointment:', appointment);
        console.log('All Product Report:', allProductReport);
        console.log('Demand Received:', demandReceived);
        console.log('Issue Product:', issueProduct);
        console.log('Token:', token);

        toast.success('Login successful');
        setManager({ managerId: '', password: '' });

        navigate('/Manager-Home');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="relative h-screen">
      <img src={Bg} className="w-screen h-screen object-cover" alt="Background" />
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center">
        <div className="w-4/5 md:w-1/4 border rounded-lg shadow p-5">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-3xl dark:text-white">
              Manager Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="managerId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Manager ID
                </label>
                <input
                  type="text"
                  name="managerId"
                  id="managerId"
                  onChange={handleInput}
                  className="w-full bg-transparent border-b border-gray-300 px-4 py-2 focus:outline-none text-white"
                  placeholder="Manager ID"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleInput}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-gray-300 px-4 py-2 focus:outline-none text-white mb-6"
                  required
                />
              </div>
              <div className="mt-20 flex justify-center items-center">
                <button
                  type="submit"
                  className="w-1/2 flex justify-center items-center hover:bg-gray-500 hover:text-black text-xl font-bold text-white border p-3 rounded-xl"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerLogin;
