import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Typography } from '@mui/material'
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

export default function BirthdayReminderGrid () {
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

  const rows = React.useMemo(() => generateFakeData(100), [])

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

  return (
    <Box sx={{ height: 500, width: '100%', marginLeft: '15px' }}>
      <Typography variant='h4' align='center' gutterBottom>
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
          density: true,
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
        
      />
      
    </Box>
  )
}