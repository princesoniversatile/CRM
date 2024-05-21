// export default SearchBar
import React, { useState, useCallback } from 'react';

// import Button from '@mui/material/Button'

import Header from './shortModules/Header';
import { fetchDataFromBackend } from './utils/api';
import LocationInput from './shortModules/LocationInput';
import IndustryInput from './shortModules/IndustryInput';
import ResultsDisplay from './shortModules/ResultsDisplay';
import ChannelDropdown from './shortModules/ChannelDropdown';

const SearchBar = () => {
  const [channel, setChannel] = useState('indiamart');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [results, setResults] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingResults, setFetchingResults] = useState(false);

  const channelOptions = [
    { value: 'indiamart', label: 'IndiaMart' },
    { value: 'justdial', label: 'JustDial' },
    { value: 'tradeindia', label: 'TradeIndia' },
    { value: 'exportersindia', label: 'ExportersIndia - ProductExplorer' },
    { value: 'alibaba', label: 'Alibaba - ProductExplorer' },
    { value: 'tradewheel', label: 'TradeWheel - ProductExplorer' },
    { value: 'etsy', label: 'Etsy' },
    // { value: 'overstock', label: 'Overstock' },
    // { value: 'newegg', label: 'Newegg' },
    // { value: 'wayfair', label: 'Wayfair' },
    // { value: 'asos', label: 'ASOS' },
    { value: 'fiverr', label: 'Fiverr' },
    // { value: 'dribbble', label: 'Dribbble' },
  ];

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      if (!dataFetched) {
        setFetchingResults(true);
      }
      const data = await fetchDataFromBackend(channel, location, industry);
      setResults(data);
      setDataFetched(true);
      setShowError(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error state or display an error message to the user
    } finally {
      setLoading(false);
      setFetchingResults(false);
    }
  }, [channel, location, industry, dataFetched]);

  const handleSearch = () => {
    if (channel && industry) {
      fetchResults();
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  let errorMessage = '';
  if (location === '' && industry === '') {
    errorMessage = 'Please enter location and industry to fetch data.';
  } else if (location === '') {
    errorMessage = 'Please enter location to fetch data.';
  } else if (industry === '') {
    errorMessage = 'Please enter industry to fetch data.';
  }

  return (
    <div className="container mx-auto p-4">
      <Header />

      <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
        <ChannelDropdown options={channelOptions} onSelectChannel={setChannel} />
        <LocationInput onLocationChange={setLocation} onLocationKeyPress={handleSearch} />
        <IndustryInput onIndustryChange={setIndustry} onIndustryKeyPress={handleSearch} />

        <button
          onClick={handleSearch}
          className="bg-black hover:bg-blue-900 text-white font-bold mt-7 py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Search
        </button>
      </div>
      {loading && <p className="text-center">Fetching results...</p>}
      {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
      {dataFetched && <ResultsDisplay results={results} loading={loading || fetchingResults} />}
    </div>
  );
};

export default SearchBar;
