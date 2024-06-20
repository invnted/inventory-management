import React, { useState } from 'react'

function RadioButton() {
    const [selectedOption, setSelectedOption] = useState('1');

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div>
        <div className=" flex items-center justify-center ">
      <div className="rounded text-white">
        <form className='grid grid-cols-1 md:grid-cols-3'>
          <div className="p-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-indigo-600"
                name="options"
                value="1"
                checked={selectedOption === '1'}
                onChange={handleRadioChange}
              />
              <span className="ml-2">Admin</span>
            </label>
          </div>
          <div className="p-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-indigo-600"
                name="options"
                value="2"
                checked={selectedOption === '2'}
                onChange={handleRadioChange}
              />
              <span className="ml-2">Manager</span>
            </label>
          </div>
          <div className="p-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-indigo-600"
                name="options"
                value="3"
                checked={selectedOption === '3'}
                onChange={handleRadioChange}
              />
              <span className="ml-2">User</span> 
            </label>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default RadioButton