// LeadHistory.jsx

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'lead_name', headerName: 'Lead Name', width: 200 },
  { field: 'lead_date', headerName: 'Lead Date', width: 180 },
  { field: 'follow_up', headerName: 'Follow-up Date', width: 180 },
  { field: 'followup_description', headerName: 'Follow-up Remarks', width: 300 },
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
    try {
      const response = await axios.get('http://localhost:5001/lead-history');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching lead history:', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilteredLeadName(value === '' ? '' : value);
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
        <Button variant='contained' onClick={resetFilters} sx={{ marginLeft: 2 }}>
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
          <Typography variant='body1' style={{ marginTop: '10px' }}>
            No follow-up history found.
          </Typography>
        </div>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={filteredRows}
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
