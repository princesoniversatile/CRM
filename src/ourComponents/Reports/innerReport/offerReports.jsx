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

const OfferReports = () => {
  const [data, setData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [loading, setLoading] = useState(true)

  // const columns = [
  //   { field: 'full_name', headerName: 'Customer Name', width: 180 },
  //   { field: 'email_address', headerName: 'Email Address', width: 200 },
  //   {
  //     field: 'dob',
  //     headerName: 'Date of Birth',
  //     width: 200,
  //     type: 'date',
  //   },
  //   {
  //     field: 'city',
  //     headerName: 'City',
  //     width: 200,
  //   },
  //   {
  //     field: 'state',
  //     headerName: 'State',
  //     width: 200,
  //   },
  // ]

  const columns = [
    { field: 'name', headerName: 'Offer Name', width: 150, editable: true },
    {
      field: 'description',
      headerName: 'Offer Description',
      width: 290,
    },
    {
      field: 'start_date',
      headerName: 'Offer Start Date',
      type: 'date',
      width: 130,
    },
    {
      field: 'end_date',
      headerName: 'Offer End Date',
      type: 'date',
      width: 130,
    },
    {
      field: 'type',
      headerName: 'Offer Type',
      width: 100,
    },
    {
      field: 'amount',
      headerName: 'Offer Amount',
      width: 100,
    },
  ]

  const handleSearch = event => {
    setSearchText(event.target.value)
  }

  const handleFilter = useCallback(() => {
    let filteredData = originalData.filter(item => {
      const isMatch =
        (!startDate || new Date(item.start_date) >= new Date(startDate)) &&
        (!endDate || new Date(item.end_date) <= new Date(endDate)) &&
        (item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          // item.phone_number.toLowerCase().includes(searchText.toLowerCase()) ||
          item.description.toLowerCase().includes(searchText.toLowerCase()) ||
          item.type.toLowerCase().includes(searchText.toLowerCase()) ||
          item.amount.toLowerCase().includes(searchText.toLowerCase())
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
        const response = await axios.get(`${import.meta.env.VITE_API}/offers`)
        const fetchedData = response.data.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          amount: Math.round(item.amount) +"%",
          description: item.description,
          start_date:new Date(item.start_date),
          end_date:new Date(item.end_date),
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            autoHeight
            density='comfortable'
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

export default OfferReports
