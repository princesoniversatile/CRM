import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbar } from '@mui/x-data-grid';
import { TextField, Grid, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const offerTypes = ['Discount', 'Deal', 'Other'];
const randomOfferType = () => {
  return offerTypes[Math.floor(Math.random() * offerTypes.length)];
};

// Function to generate random dates
const randomDate = () => {
  const start = new Date(2022, 0, 1); // January 1, 2022
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Initial Rows
const initialData = [
  {
    id: 1,
    offerName: 'Summer Sale',
    offerDescription: 'Get up to 50% off on summer collection',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '50%',
  },
  {
    id: 2,
    offerName: 'Black Friday Deal',
    offerDescription: 'Exclusive Black Friday deals up to 70%',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '70%',
  },
  {
    id: 3,
    offerName: 'New Year Discount',
    offerDescription: 'Celebrate New Year with 30% off',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '30%',
  },
  {
    id: 4,
    offerName: 'Holiday Special',
    offerDescription: 'Holiday deals up to 40%',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '40%',
  },
  {
    id: 5,
    offerName: 'Flash Sale',
    offerDescription: 'Limited time flash sale with 60% off',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '60%',
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const OfferReports = () => {
  const [data, setData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const columns = [
    { field: 'offerName', headerName: 'Offer Name', width: 150, editable: true },
    {
      field: 'offerDescription',
      headerName: 'Offer Description',
      width: 290,
      editable: true,
    },
    {
      field: 'offerStartDate',
      headerName: 'Offer Start Date',
      type: 'date',
      width: 130,
      editable: true,
    },
    {
      field: 'offerEndDate',
      headerName: 'Offer End Date',
      type: 'date',
      width: 130,
      editable: true,
    },
    {
      field: 'offerType',
      headerName: 'Offer Type',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: offerTypes,
    },
    {
      field: 'offerAmount',
      headerName: 'Offer Amount',
      width: 100,
      editable: true,
    },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleFilter = () => {
    let filteredData = initialData.filter((item) => {
      const isMatch =
        (!startDate || new Date(item['offerStartDate']) >= new Date(startDate)) &&
        (!endDate || new Date(item['offerStartDate']) <= new Date(endDate)) &&
        (item['offerName'].toLowerCase().includes(searchText.toLowerCase()) ||
          item['offerDescription'].toLowerCase().includes(searchText.toLowerCase()) ||
          item['offerType'].toLowerCase().includes(searchText.toLowerCase()));
      return isMatch;
    });
    setData(filteredData);
  };

  useEffect(() => {
    return handleFilter;
  }, [handleSearch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ height: 400, width: '100%', marginTop: 16 }}>
        <Grid container spacing={2} alignItems="center" style={{ marginBottom: 16 }}>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="Search"
              value={searchText}
              onChange={handleSearch}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleFilter} fullWidth>
              Filter
            </Button>
          </Grid>
        </Grid>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          autoHeight
          components={{
            Toolbar: CustomToolbar,
          }}
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default OfferReports;
