import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
          managerData: {
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

        navigate('/Manager-Dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Manager");
    const navigate = useNavigate();

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    const handleOptionClick = (option, path) => {
      setSelectedOption(option);
      setIsOpen(false);
      navigate(path);
    };

    return (
      <div className="relative inline-block text-center w-full mt-5 ">
        
        <div>
          <button
            type="button"
            className="inline-flex bg-sky-500 text-xl justify-center w-full rounded-md  shadow-sm px-4 py-2  font-semibold text-white"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={toggleDropdown}
          >
            {selectedOption}
            <svg className="-mr-2 ml-4 h-5 w-5 text-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div
            className="origin-top-center absolute left-1/2 transform -translate-x-1/2 mt-2 w-full max-w-sm rounded-md shadow-lg bg-sky-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex="-1"
          >
            <div className="py-1 text-center " role="none">
              <button
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-sky-600"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-0"
                onClick={() => handleOptionClick('Admin', '/login')}
              >
                Admin
              </button>
              <button
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-sky-600"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-1"
                onClick={() => handleOptionClick('Manager', '/manager-login')}
              >
                Manager
              </button>
              <button
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-sky-600"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-2"
                onClick={() => handleOptionClick('Moderator', '/moderator-login')}
              >
                Moderator
              </button>
              <button
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-sky-600"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-3"
                onClick={() => handleOptionClick('User', '/')}
              >
                User
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="relative h-screen bg-sky-800">
      <div className="absolute inset-0  flex items-center justify-center">
        <div className="w-4/5 md:w-1/4 border rounded-lg shadow p-5">
        <Dropdown/>
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