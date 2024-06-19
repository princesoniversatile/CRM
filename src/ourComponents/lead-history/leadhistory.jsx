import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Toolbar,
  TablePagination,
  Grid,
  TextField,
} from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md'
import axios from 'axios'
import { format } from 'date-fns'
import SvgColor from 'src/components/svg-color'
import { Container } from '@mui/system'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const columns = [
  // { field: 'id', headerName: 'ID', width: 120 },
  { field: 'lead_name', headerName: 'Lead Name', width: 200 },
  { field: 'lead_date', headerName: 'Lead Date', width: 180 },
  { field: 'follow_up', headerName: 'Follow-up Date', width: 180 },
  { field: 'followup_description', headerName: 'Follow-up Remarks', width: 300 },
]

const LeadHistory = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchText, setSearchText] = useState('')
  const [filteredLeadName, setFilteredLeadName] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  useEffect(() => {
    fetchLeadHistory()
  }, [])
const api=import.meta.env.VITE_API
  const fetchLeadHistory = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${api}/lead-history`)
      setRows(
        response.data.map(row => ({
          ...row,
          lead_date: formatDate(row.lead_date),
          follow_up: formatDate(row.follow_up),
        }))
      )
    } catch (error) {
      console.error('Error fetching lead history:', error)
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return format(date, 'dd/MM/yyyy')
  }

  const handleSearch = event => {
    const value = event.target.value.toLowerCase()
    setSearchText(value)
  }

  const handleFilterChange = event => {
    const value = event.target.value
    setFilteredLeadName(value === '' ? '' : value)
  }

  const handleStartDateChange = newValue => {
    setStartDate(newValue)
  }

  const handleEndDateChange = newValue => {
    setEndDate(newValue)
  }

  const resetFilters = () => {
    setSearchText('')
    setFilteredLeadName('')
    setStartDate(null)
    setEndDate(null)
  }

  const filteredRows = rows.filter(
    row =>
      row.lead_name.toLowerCase().includes(searchText) &&
      (filteredLeadName === '' || row.lead_name === filteredLeadName) &&
      (startDate === null || new Date(row.follow_up) >= new Date(startDate)) &&
      (endDate === null || new Date(row.follow_up) <= new Date(endDate))
  )

  const handleEditClick = id => {
    console.log(`Edit lead with ID ${id}`)
  }

  const handleDeleteClick = id => {
    console.log(`Delete lead with ID ${id}`)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Typography
          variant='h4'
          component='h2'
          gutterBottom
          mb={2.5}
          style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        >
          <SvgColor
            src={`/assets/icons/navbar/ic_lead_history.svg`}
            sx={{ width: 50, height: 30, marginRight: 2 }}
          />
          FollowUp History
        </Typography>
        <Toolbar alignItems='center' justifyContent='space-between'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              
              gap: 2,
            }}
          >
            <FormControl variant='outlined'  sx={{ minWidth: 250 }}>
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
                {Array.from(new Set(rows.map(row => row.lead_name))).map(leadName => (
                  <MenuItem key={leadName} value={leadName}>
                    {leadName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid item xs={12} sm={4} md={3}>
              <DatePicker
                label='Start Date'
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={params => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <DatePicker
                label='End Date'
                value={endDate}
                onChange={handleEndDateChange}
                renderInput={params => <TextField {...params} />}
              />
            </Grid>
            <Button
              variant='contained'
              size='large'
              color='inherit'
              onClick={resetFilters}
              sx={{ mt: { xs: 2, sm: 0 } }}
            >
              Reset
            </Button>
          </Box>
        </Toolbar>
        <TablePagination
          position='right'
          page={page}
          component='div'
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25, 50, 70]}
          onRowsPerPageChange={event => {
            setRowsPerPage(parseInt(event.target.value, 10))
            setPage(0)
          }}
        />
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredRows.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant='body1' sx={{ mt: 1 }}>
              No follow-up history found.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 373, width: '100%' }}>
            <DataGrid
              columns={columns}
              rows={filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
              pageSize={rowsPerPage}
              onPageChange={params => setPage(params.page)}
              onPageSizeChange={params => setRowsPerPage(params.pageSize)}
              pagination
              components={{ Toolbar: GridToolbar }}
              autoHeight={false}
              pageSizeOptions={[5, 10, 15, 1000]}
            />
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  )
}

export default LeadHistory
