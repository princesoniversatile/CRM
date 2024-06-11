
import React, { useEffect, useState, useCallback } from 'react'
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbar } from '@mui/x-data-grid'
import { TextField, Grid, Button, CircularProgress } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import axios from 'axios'

function CustomToolbar () {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

const ResolutionReport = () => {
  const [data, setData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [loading, setLoading] = useState(true)

  const columns = [
    { field: 'complaint_name', headerName: 'Complain Name', width: 220 },
    // { field: 'email_address', headerName: 'Email Address', width: 200 },
    { field: 'resolved_by', headerName: 'Resolved By', width: 150 },
    {
      field: 'resolution_date',
      headerName: 'Date Of Birth',
      width: 200,
      type: 'date',
    },
    {
      field: 'resolution_description',
      headerName: 'Resolution Description',
      width: 200,
    },
    {
      field: 'resolution_status',
      headerName: 'Resolution Status',
      width: 200,
    },
  ]

  const handleSearch = event => {
    setSearchText(event.target.value)
  }

  const handleFilter = useCallback(() => {
    let filteredData = originalData.filter(item => {
      const isMatch =
        (!startDate || new Date(item.resolution_date) >= new Date(startDate)) &&
        (!endDate || new Date(item.resolution_date) <= new Date(endDate)) &&
        (item.complaint_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.resolved_by.toLowerCase().includes(searchText.toLowerCase()) ||
          item.email_address.toLowerCase().includes(searchText.toLowerCase()) 
        )
      return isMatch
    })
    setData(filteredData)
  }, [startDate, endDate, searchText, originalData])

  const resetData = () => {
    setSearchText('')
    setStartDate(null)
    setEndDate(null)
    setData(originalData)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.10:5001/resolutions`)
        const fetchedData = response.data.map(item => ({
          id: item.id,
          complaint_name: item.complaint_name,
          resolution_date: new Date(item.resolution_date),
          resolved_by: item.resolved_by,
          resolution_description: item.resolution_description,
          resolution_status: item.resolution_status
          
        }))
        setData(fetchedData)
        setOriginalData(fetchedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchText === '' && startDate === null && endDate === null) {
      resetData()
    } else {
      handleFilter()
    }
  }, [startDate, endDate, searchText, handleFilter])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ height: 400, width: '100%', marginTop: 16 }}>
        <Grid container spacing={2} alignItems='center' style={{ marginBottom: 16 }}>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label='Search'
              value={searchText}
              onChange={handleSearch}
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <DatePicker
              label='Start Date'
              value={startDate}
              onChange={date => setStartDate(date)}
              renderInput={params => <TextField {...params} variant='outlined' fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <DatePicker
              label='End Date'
              value={endDate}
              onChange={date => setEndDate(date)}
              renderInput={params => <TextField {...params} variant='outlined' fullWidth />}
            />
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' onClick={handleFilter} fullWidth>
              Filter
            </Button>
          </Grid>
          <Grid item>
            <Button variant='contained' color='secondary' onClick={resetData} fullWidth>
              Reset
            </Button>
          </Grid>
        </Grid>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </div>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            autoHeight
            density="comfortable"
            components={{
              Toolbar: CustomToolbar,
            }}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        )}
      </div>
    </LocalizationProvider>
  )
}

export default ResolutionReport
