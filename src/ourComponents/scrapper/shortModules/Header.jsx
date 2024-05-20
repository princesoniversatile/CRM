// Header.js
import React from 'react';
// import { ReactComponent as WebFlowIcon } from '../images/webflow (1).svg'; // Correct path to the SVG file

const Header = () => {
  return (
    <header className="bg-blue-500 text-blue-200 py-4 text-center">
      <div className="flex justify-center items-center mb-2">
        {/* Include your SVG icon */}
        {/* <WebFlowIcon className="w-8 h-8 mr-2" /> */}
        {/* Header Title */}
        <h1 className="text-2xl font-bold"> Web Harvest Wizard</h1>
      </div>
    </header> //ye header ke liye ok bhai api kha hit hor
  );
};

export default Header;
