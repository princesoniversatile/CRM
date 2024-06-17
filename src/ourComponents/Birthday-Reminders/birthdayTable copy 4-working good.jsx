import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import SvgColor from 'src/components/svg-color'
import { MdMoreVert as MoreVertIcon } from 'react-icons/md'
import Label from 'src/components/label'
// import MoreVertIcon from '@mui/icons-material/MoreVert';

const VISIBLE_FIELDS = ['name', 'mobileNo', 'dob', 'messageStatus']

const formatDOB = dob => {
  const date = new Date(dob)
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  return formattedDate
}

export default function BirthdayReminderGrid () {
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState(
    VISIBLE_FIELDS.map(field => ({
      field,
      headerName:
        field.charAt(0).toUpperCase() +
        field
          .slice(1)
          .replace(/([A-Z])/g, ' $1')
          .trim(), // Convert camelCase to Title Case
      width: 200,
      cellClassName: params =>
        params.field === 'messageStatus' && params.value === 'sent' ? 'sent-cell' : '',
      align: 'center', // Center align text in cells
      headerAlign: 'center', // Center align text in headers
      hide: false,
    }))
  )
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/customers`)
        const data = response.data.map((item, index) => ({
          id: index + 1,
          name: item.full_name, // Replace with actual field from API response
          mobileNo: item.phone_number, // Temporarily generating random mobile numbers
          dob: formatDOB(item.dob), // Temporarily generating random DOBs
          messageStatus: 'Sent',
        }))
        setRows(data)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchData()
  }, [])

  const handleColumnVisibilityChange = (field, event) => {
    const checked = event.target.checked
    setColumns(prevColumns =>
      prevColumns.map(col => {
        if (col.field === field) {
          return { ...col, hide: !checked }
        }
        return col
      })
    )
  }

  return (
    <Box sx={{ height: 450, width: '100%', marginLeft: '15px', overflow: 'hidden' }}>
      <Toolbar>
        <Typography variant='h4' align='center' gutterBottom style={{ flexGrow: 1 }}>
          <SvgColor
            src={`/assets/icons/navbar/ic_cakes.svg`}
            sx={{ width: 50, height: 30, marginRight: 2 }}
          />
          Birthday Reminders
        </Typography>

        <IconButton
          aria-label='show more columns'
          aria-controls='menu-columns'
          aria-haspopup='true'
          onClick={handleMenuClick}
        >
          <Label>Show more Details..</Label>
          <MoreVertIcon />
        </IconButton>
        <Menu id='menu-columns' anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
          {columns.map(col => (
            <MenuItem key={col.field}>
              <label>
                <input
                  type='checkbox'
                  checked={!col.hide}
                  onChange={e => handleColumnVisibilityChange(col.field, e)}
                  sx={{ marginLeft: '20px', marginRight: '20px' }}
                />{' '}
                {col.headerName}
              </label>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>

      <DataGrid
        rows={rows}
        columns={columns.filter(col => !col.hide)}
        disableColumnFilter={false}
        disableColumnSelector={true} // Disable the default column selector
        disableDensitySelector={false}
        components={{
          Toolbar: GridToolbar,
        }}
        toolbarOptions={{
          showQuickFilter: true,
          // density: true,
          density: 'comfortable',
          columnsButton: false, // Disable MUI internal columns button
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
        sx={{
          textAlign: 'center',
          '& .MuiDataGrid-root': {
            border: '1px solid #ddd',
          },
          '& .MuiDataGrid-cell': {
            textAlign: 'center', // Center align text in cells
            borderBottom: '1px solid #ddd',
          },
          '& .MuiDataGrid-columnHeader': {
            textAlign: 'center', // Center align text in headers
            borderBottom: '1px solid #ddd',
          },
          '& .sent-cell': {
            backgroundColor: '#f0f8ff', // Light blue background for 'Sent' cells
            fontWeight: 'bold',
          },
        }}
      />
    </Box>
  )
}
