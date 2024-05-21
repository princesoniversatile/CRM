// Header.js
import React from 'react';
import { SiWebmoney } from "react-icons/si";// import { ReactComponent as WebFlowIcon } from '../images/webflow (1).svg'; // Correct path to the SVG file

const Header = () => {
  return (
    <header className="bg-black text-blue-200 py-2 text-center">
      <div className="flex justify-center items-center ">
        {/* Include your SVG icon */}
        {/* <WebFlowIcon className="w-8 h-8 mr-2" /> */}
        {/* Header Title */}
        <SiWebmoney className='text-white text-xl mr-2'/>
        <h2 className="text-xl font-bold text-white">Web Harvest Wizard</h2>
      </div>
    </header> //ye header ke liye ok bhai api kha hit hor
  );
};

export default Header;
