import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

const VISIBLE_FIELDS = ['name', 'mobileNo', 'dob', 'messageStatus'];

const formatDOB = (dob) => {
  const date = new Date(dob);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  return formattedDate;
};

export default function BirthdayReminderGrid() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/customers`);
        const data = response.data.map((item, index) => ({
          id: index + 1,
          name: item.full_name, // Replace with actual field from API response
          mobileNo: item.phone_number, // Temporarily generating random mobile numbers
          dob: formatDOB(item.dob), // Temporarily generating random DOBs
          messageStatus: 'Sent',
        }));
        setRows(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(
    () =>
      VISIBLE_FIELDS.map((field) => ({
        field,
        headerName:
          field.charAt(0).toUpperCase() +
          field
            .slice(1)
            .replace(/([A-Z])/g, ' $1')
            .trim(), // Convert camelCase to Title Case
        width: 200,
        cellClassName: (params) =>
          params.field === 'messageStatus' && params.value === 'sent' ? 'sent-cell' : '',
      })),
    []
  );

  return (
    <Box sx={{ height: 500, width: '100%', marginLeft: '15px', overflow: 'hidden' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Birthday Reminders
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnFilter={false}
        disableColumnSelector={false}
        disableDensitySelector={false}
        components={{
          Toolbar: GridToolbar,
        }}
        toolbarOptions={{
          showQuickFilter: true,
          // density: true,
          density: 'comfortable',
          columnsButton: true,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
        sortModel={[
          {
            field: 'dob',
            sort: 'asc',
          },
        ]}
      />
    </Box>
  );
}
