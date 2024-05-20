// ChannelDropdown.js
import React from 'react';

const ChannelDropdown = ({ options, onSelectChannel }) => {
  return (
    <div className="my-4">
      <label htmlFor="channelSelect" className="block font-semibold mb-2">Select Channel:</label>
      <select
        id="channelSelect"
        onChange={(e) => onSelectChannel(e.target.value)}
        className="border p-2 rounded-md w-full"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default ChannelDropdown;
