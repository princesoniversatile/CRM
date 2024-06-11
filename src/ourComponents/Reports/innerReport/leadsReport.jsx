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

const LeadsReport = () => {
  const [data, setData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [loading, setLoading] = useState(true)

  const columns = [
    { field: 'lead_name', headerName: 'Lead Name', width: 180 },
    { field: 'company_name', headerName: 'Company', width: 230 },
    {
      field: 'follow_up',
      headerName: 'FollowUp Date',
      width: 150,
      type: 'date',
    },
    {
      field: 'followup_description',
      headerName: 'State',
      width: 150,
    },
    {
      field: 'phone_number',
      headerName: 'Phone Number',
      width: 150,
    },
   
  ]

  const handleSearch = event => {
    setSearchText(event.target.value)
  }

  const handleFilter = useCallback(() => {
    let filteredData = originalData.filter(item => {
      const isMatch =
        (!startDate || new Date(item.follow_up) >= new Date(startDate)) &&
        (!endDate || new Date(item.follow_up) <= new Date(endDate)) &&
        (item.lead_name.toLowerCase().includes(searchText.toLowerCase()) ||
          // item.phone_number.toLowerCase().includes(searchText.toLowerCase()) ||
          item.email.toLowerCase().includes(searchText.toLowerCase()) ||
          item.phone_number.toLowerCase().includes(searchText.toLowerCase()) ||
          item.followup_description.toLowerCase().includes(searchText.toLowerCase()))
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
        const response = await axios.get(`${import.meta.env.VITE_API}/leads`)
        const fetchedData = response.data.map(item => ({
          id: item.id,
          lead_name: item.lead_name,
          company_name: item.company_name,
          follow_up: new Date(item.follow_up),
          email: item.email,
          phone_number: item.phone_number,
          followup_description: item.followup_description,
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
            {...data}
           
            autoHeight
            density='comfortable'
            components={{
              Toolbar: CustomToolbar,
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            pageSize={5}
            pageSizeOptions={[5, 10, 25]}
          />
        )}
      </div>
    </LocalizationProvider>
  )
}

export default LeadsReport
