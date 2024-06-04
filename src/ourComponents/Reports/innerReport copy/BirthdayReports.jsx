import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbar } from '@mui/x-data-grid';
import { TextField, Grid, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { indianNames } from 'src/_mock/user'
import { sample } from 'lodash'

const VISIBLE_FIELDS = ['id', 'name', 'mobileNo', 'dob',  'messageStatus']
const getRandomIndianName = () => sample(indianNames)

const generateIndianMobileNo = () => {
  const leadingDigit = sample(['7', '8', '9'])
  const restDigits = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, '0')
  return `+91 ${leadingDigit}${restDigits}`
}

function generateLastDOB() {
    const day = Math.floor(Math.random() * 28) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    const year = Math.floor(Math.random() * 36) + 1970; // 2005 tak
  
    return `${day}/${month}/${year}`;
  }




// const initialData = [
//     {
//       id: 1,
//       'customer-name': 'John Doe',
//       'complain-date': new Date('2024-05-13'),
//       'complaint-type': 'Claim',
//       title: 'Complain 1',
//       description: 'This is the first Complain.',
//       status: 'Pending',
//     },
//     {
//       id: 2,
//       'customer-name': 'Jane Smith',
//       'complain-date': new Date('2024-05-08'),
//       'complaint-type': 'Repair',
//       title: 'Complain 2',
//       description: 'This is the second Complain.',
//       status: 'In Progress',
//     },
//     {
//       id: 3,
//       'customer-name': 'Alice Johnson',
//       'complain-date': new Date('2024-05-12'),
//       'complaint-type': 'Warranty',
//       title: 'Complain 3',
//       description: 'This is the third Complain.',
//       status: 'Resolved',
//     },
//     {
//       id: 4,
//       'customer-name': 'Bob Brown',
//       'complain-date': new Date('2024-05-09'),
//       'complaint-type': 'Other',
//       title: 'Complain 4',
//       description: 'This is the fourth Complain.',
//       status: 'Closed',
//     },
//     {
//       id: 5,
//       'customer-name': 'Eve Wilson',
//       'complain-date': new Date('2024-05-11'),
//       'complaint-type': 'Claim',
//       title: 'Complain 5',
//       description: 'This is the fifth Complain.',
//       status: 'Pending',
//     },
//   ]

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const BirthdayReports = () => {
    const generateFakeData = rowLength => {
        const rows = []
        for (let i = 0; i < rowLength; i++) {
          rows.push({
            id: i + 1,
            name: getRandomIndianName(),
            mobileNo: generateIndianMobileNo(),
            dob: generateLastDOB(),
            // dateTime: new Date().toLocaleString(),
            messageStatus: Math.random() < 0.5 ? 'Sent' : 'Sent',
          })
        }
        return rows
      }
    const initialData = React.useMemo(() => generateFakeData(100), [])

  const [data, setData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

//   const columns = [
//     { field: 'customer-name', headerName: 'Customer Name', width: 180, editable: true },
//     {
//       field: 'complain-date',
//       headerName: 'Complain Date',
//       width: 130,
//       editable: true,
//       type: 'date',
//     },
//     {
//       field: 'complaint-type',
//       headerName: 'Complain Type',
//       width: 130,
//       editable: true,
//       type: 'singleSelect',
//       valueOptions: ['Claim', 'Warranty', 'Repair', 'Other'],
//     },
//     { field: 'title', headerName: 'Title', width: 130, editable: true },
//     { field: 'description', headerName: 'Description', width: 200, editable: true },
//     {
//       field: 'status',
//       headerName: 'Status',
//       width: 130,
//       editable: true,
//       type: 'singleSelect',
//       valueOptions: ['Pending', 'In Progress', 'Resolved'],
//     },

//   ]




const columns = React.useMemo(
    () =>
      VISIBLE_FIELDS.map(field => ({
        field,
        headerName:
          field.charAt(0).toUpperCase() +
          field
            .slice(1)
            .replace(/([A-Z])/g, ' $1')
            .trim(), // Convert camelCase to Title Case
        width: 168,
      })),
    []
  )

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleFilter = () => {
    let filteredData = initialData.filter((item) => {
      const isMatch =
        (!startDate || new Date(item['dob']) >= new Date(startDate)) &&
        (!endDate || new Date(item['dob']) <= new Date(endDate)) &&
        (item['name'].toLowerCase().includes(searchText.toLowerCase()) ||
        //   item['id'].toLowerCase().includes(searchText.toLowerCase()) ||
          item['mobileNo'].toLowerCase().includes(searchText.toLowerCase()));
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

export default BirthdayReports;
