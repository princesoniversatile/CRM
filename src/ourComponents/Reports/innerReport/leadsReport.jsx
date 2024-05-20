import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbar } from '@mui/x-data-grid';
import { TextField, Grid, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const initialData = [
  { id: 1, customer: 'Amiah Pruitt', company: 'Company A', role: 'Manager', createDate: '2024-04-29', dueDate: '2024-06-22', amount: 2331.63, status: 'Paid' },
  { id: 2, customer: 'Ariana Lang', company: 'Company B', role: 'Developer', createDate: '2024-04-30', dueDate: '2024-06-21', amount: 2372.93, status: 'Overdue' },
  { id: 3, customer: 'Lawson Bass', company: 'Company C', role: 'Designer', createDate: '2024-05-01', dueDate: '2024-06-20', amount: 2283.97, status: 'Paid' },
  // add more data as needed
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const LeadsReport = () => {
  const [data, setData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const columns = [
    { field: 'customer', headerName: 'Customer', width: 180 },
    { field: 'company', headerName: 'Company', width: 180 },
    { field: 'role', headerName: 'Role', width: 180 },
    { field: 'createDate', headerName: 'Create Date', width: 180 },
    // { field: 'dueDate', headerName: 'Due Date', width: 180 },
    // { field: 'amount', headerName: 'Amount', width: 180 },
    { field: 'status', headerName: 'Status', width: 180 },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);

  };

  const handleFilter = () => {
    let filteredData = initialData.filter((item) => {
      const isMatch =
        (!startDate || new Date(item.createDate) >= new Date(startDate)) &&
        (!endDate || new Date(item.createDate) <= new Date(endDate)) &&
        (item.customer.toLowerCase().includes(searchText.toLowerCase()) ||
          item.company.toLowerCase().includes(searchText.toLowerCase()) ||
          item.role.toLowerCase().includes(searchText.toLowerCase()));
      return isMatch;
    });
    setData(filteredData);
  };

  useEffect(()=>{
    return handleFilter()
  },[handleSearch])
  

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ height: 400, width: '100%' }}>
        <Grid container spacing={2} alignItems="center" style={{ marginBottom: 16 }}>
          <Grid item>
            <TextField
              label="Search"
              value={searchText}
              onChange={handleSearch}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
          </Grid>
          <Grid item>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Grid>
        </Grid>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
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

export default LeadsReport;
