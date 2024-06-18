// LeadHistory.jsx

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  CircularProgress,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md';

const columns = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'lead_name', headerName: 'Lead Name', width: 200 },
  { field: 'lead_date', headerName: 'Lead Date', width: 180 },
  { field: 'follow_up_date', headerName: 'Follow-up Date', width: 180 },
  { field: 'follow_up_remarks', headerName: 'Follow-up Remarks', width: 300 },
];

const LeadHistory = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [filteredLeadName, setFilteredLeadName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchLeadHistory();
  }, []);

  const fetchLeadHistory = async () => {
    setLoading(true);
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Example data, replace with actual API response
    const response = [
      { id: 1, lead_name: 'John Doe', lead_date: '2024-06-18', follow_up_date: '2024-06-25', follow_up_remarks: 'Interested in product A.' },
      { id: 2, lead_name: 'Jane Smith', lead_date: '2024-06-17', follow_up_date: '2024-06-24', follow_up_remarks: 'Needs more information about product B.' },
      { id: 3, lead_name: 'James Brown', lead_date: '2024-06-16', follow_up_date: '2024-06-23', follow_up_remarks: 'Wants a demo of product C.' },
      { id: 4, lead_name: 'Jessica White', lead_date: '2024-06-15', follow_up_date: '2024-06-22', follow_up_remarks: 'Ready to purchase product D.' },
      { id: 5, lead_name: 'Jack Black', lead_date: '2024-06-14', follow_up_date: '2024-06-21', follow_up_remarks: 'Asking for discounts on product E.' },
      { id: 6, lead_name: 'John Doe', lead_date: '2024-06-18', follow_up_date: '2024-06-25', follow_up_remarks: 'Interested in product A.' },
    ];
    setRows(response);
    setLoading(false);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
  };

  const handleFilterChange = (event) => {
    setFilteredLeadName(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const resetFilters = () => {
    setSearchText('');
    setFilteredLeadName('');
    setStartDate('');
    setEndDate('');
  };

  const filteredRows = rows.filter(
    (row) =>
      row.lead_name.toLowerCase().includes(searchText) &&
      (filteredLeadName === '' || row.lead_name === filteredLeadName) &&
      (startDate === '' || row.follow_up_date >= startDate) &&
      (endDate === '' || row.follow_up_date <= endDate)
  );

  const handleEditClick = (id) => {
    console.log(`Edit lead with ID ${id}`);
    // Add your edit logic here
  };

  const handleDeleteClick = (id) => {
    console.log(`Delete lead with ID ${id}`);
    // Add your delete logic here
  };

  return (
    <div>
      <Typography variant='h5' component='h2' gutterBottom>
        Lead History
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <FormControl variant='outlined' sx={{ minWidth: 200, marginRight: 2 }}>
          <InputLabel id='lead-name-filter-label'>Lead Name</InputLabel>
          <Select
            labelId='lead-name-filter-label'
            id='lead-name-filter'
            value={filteredLeadName}
            onChange={handleFilterChange}
            label='Lead Name'
          >
            <MenuItem value=''>
              <em>All Leads</em>
            </MenuItem>
            {Array.from(new Set(rows.map((row) => row.lead_name))).map((leadName) => (
              <MenuItem key={leadName} value={leadName}>
                {leadName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id='start-date-filter'
          label='Start Date'
          type='date'
          variant='outlined'
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleStartDateChange}
          value={startDate}
          sx={{ marginRight: 2 }}
        />
        <TextField
          id='end-date-filter'
          label='End Date'
          type='date'
          variant='outlined'
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleEndDateChange}
          value={endDate}
        />
        <Button variant='contained' color='inherit'  onClick={resetFilters} sx={{ marginLeft: 2,marginTop:'2px' }} size='large'>
          Reset
        </Button>
      </Box>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </div>
      ) : filteredRows.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <Typography variant='body1' style={{ marginTop: '10px' }}>
              No followUp history found.
            </Typography>
          </div>
        </div>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
            pageSize={rowsPerPage}
            onPageChange={(params) => setPage(params.page)}
            onPageSizeChange={(params) => setRowsPerPage(params.pageSize)}
            pagination
            components={{ Toolbar: GridToolbar }}
            autoHeight={true}
          />
        </div>
      )}
    </div>
  );
};

export default LeadHistory;
