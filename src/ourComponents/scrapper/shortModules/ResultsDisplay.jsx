import React from 'react';

const renderServiceType = (serviceType) => {
  if (typeof serviceType === 'string') {
     <p>{serviceType}</p>;
  } else if (typeof serviceType === 'object') {
    return (
      <div>
        {Object.entries(serviceType).map(([key, value], index) => (
          <div key={index}>
            <p>
              {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
            </p>
          </div>
        ))}
      </div>
    );
  } else {
    return null; // Render nothing if serviceType is neither string nor object
  }
};

const ResultsDisplay = ({ results, loading }) => {
  console.log('Entering the results section and displaying result values:');
  console.log(results);

  return (
    <div className='my-4'>
      <h2 className='text-xl font-semibold mb-2'>Results:</h2>
      {loading ? (
        <p className='animate-pulse'>Please wait... it'll take 20-45 sec.</p>
      ) : results.data && results.data.length > 0 ? (
        <ul className='border rounded-md p-4'>
          {results.data.map((result, index) => (
            <li key={index} className='mb-4 p-2 border rounded-md'>
              <p className='font-semibold'>{result.companyName}</p>
              <p>{result.serviceTitle}</p>
              {(typeof result.serviceType === 'object') ? (
                renderServiceType(result.serviceType)
              ) : (
                <p>{result.serviceType}</p>
              )}
              {result.servicePrice !== 'Ask Price' && (
                <p>{result.servicePrice}</p>
              )}
              <p>{result.mobileNumber}</p>
              <p>{result.address}</p>
            </li>
          ))}
        </ul>
      ) : results.message ? (
        <p>{results.message}</p>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default ResultsDisplay;
