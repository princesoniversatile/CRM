import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbar } from '@mui/x-data-grid';
import { TextField, Grid, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const initialData = [
  {
    id: 1,
    'complaint-name': 'Complaint 1',
    'resolution-description': 'Resolution for complaint 1',
    'resolved-by': 'John Doe',
    'resolution-date': new Date('2024-05-15'),
    'resolution-status': 'Open',
  },
  {
    id: 2,
    'complaint-name': 'Complaint 2',
    'resolution-description': 'Resolution for complaint 2',
    'resolved-by': 'Jane Smith',
    'resolution-date': new Date('2024-05-16'),
    'resolution-status': 'Closed',
  },
  {
    id: 3,
    'complaint-name': 'Complaint 3',
    'resolution-description': 'Resolution for complaint 3',
    'resolved-by': 'Alice Johnson',
    'resolution-date': new Date('2024-05-17'),
    'resolution-status': 'Pending',
  },
  {
    id: 4,
    'complaint-name': 'Complaint 4',
    'resolution-description': 'Resolution for complaint 4',
    'resolved-by': 'Bob Brown',
    'resolution-date': new Date('2024-05-18'),
    'resolution-status': 'Closed',
  },
  {
    id: 5,
    'complaint-name': 'Complaint 5',
    'resolution-description': 'Resolution for complaint 5',
    'resolved-by': 'Eve Wilson',
    'resolution-date': new Date('2024-05-19'),
    'resolution-status': 'Pending',
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const ResolutionReport = () => {
  const [data, setData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const columns = [
    {
      field: 'complaint-name',
      headerName: 'Complaint Name',
      width: 180,
      type: 'singleSelect',
      editable: true,
      valueOptions: ['Complaint 1', 'Complaint 2', 'Complaint 3', 'Complaint 4', 'Complaint 5'],
    },
    {
      field: 'resolution-description',
      headerName: 'Resolution Description',
      width: 250,
      editable: true,
    },
    { field: 'resolved-by', headerName: 'Resolved By', width: 150, editable: true },
    {
      field: 'resolution-date',
      headerName: 'Resolution Date',
      width: 150,
      editable: true,
      valueFormatter: ({ value }) => (value ? new Date(value).toLocaleDateString() : ''),
    },
    {
      field: 'resolution-status',
      headerName: 'Resolution Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Open', 'Closed', 'Pending'],
    },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleFilter = () => {
    let filteredData = initialData.filter((item) => {
      const isMatch =
        (!startDate || new Date(item['resolution-date']) >= new Date(startDate)) &&
        (!endDate || new Date(item['resolution-date']) <= new Date(endDate)) &&
        (item['complaint-name'].toLowerCase().includes(searchText.toLowerCase()) ||
          item['resolution-description'].toLowerCase().includes(searchText.toLowerCase()) ||
          item['resolved-by'].toLowerCase().includes(searchText.toLowerCase()));
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

export default ResolutionReport;
