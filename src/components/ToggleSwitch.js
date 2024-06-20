// src/components/ToggleSwitch.js
import React, { useState } from 'react';
import './ToggleSwitch.css'; 

const ToggleSwitch = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
    onToggle(!isOn);
  };

  return (
    <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
      <div className="toggle-knob"></div>
    </div>
  );
};

export default ToggleSwitch;
