import React, { useEffect, useState, useCallback } from 'react'
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbar } from '@mui/x-data-grid'
import { TextField, Grid, Button } from '@mui/material'
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

const ComplaintReport = () => {
  const [data, setData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const columns = [
    { field: 'customer_name', headerName: 'Customer Name', width: 180, editable: true },
    { field: 'title', headerName: 'Complain Name', width: 180 },
    {
      field: 'complaint_date',
      headerName: 'Complain Date',
      width: 130,
      type: 'date',
    },
    {
      field: 'complaint_type',
      headerName: 'Complain Type',
      width: 130,
    },
    { field: 'description', headerName: 'Description', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
    },
  ]

  const handleSearch = event => {
    setSearchText(event.target.value)
  }

  const handleFilter = useCallback(() => {
    let filteredData = originalData.filter(item => {
      const isMatch =
        (!startDate || new Date(item.complaint_date) >= new Date(startDate)) &&
        (!endDate || new Date(item.complaint_date) <= new Date(endDate)) &&
        (item.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.description.toLowerCase().includes(searchText.toLowerCase()))
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
        const response = await axios.get(`${import.meta.env.VITE_API}/complaints`)
        const fetchedData = response.data.map(item => ({
          id: item.id,
          customer_name: item.customer_name,
          complaint_date: new Date(item.complaint_date),
          complaint_type: item.complaint_type,
          title: item.title,
          description: item.description,
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalizing the first letter
        }))
        setData(fetchedData)
        setOriginalData(fetchedData)
      } catch (error) {
        console.error('Error fetching data:', error)
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
  )
}

export default ComplaintReport
