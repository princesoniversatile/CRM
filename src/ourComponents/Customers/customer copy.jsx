import React, { useState, useEffect } from 'react'
import Iconify from 'src/components/iconify'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { getStateMenuItems } from './menuProvider'

import {
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  CircularProgress,
  MenuItem,
  AlertTitle,
  IconButton,
} from '@mui/material'
import {
  Container,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import { IconContext } from 'react-icons'

import { AiOutlineShopping } from 'react-icons/ai' // Add the shopping icon

import api from 'src/utils/api' // Import the axios instance
import { MdAdd as AddIcon, MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md'

function SlideTransition(props) {
  return <Slide {...props} direction='up' />
}

const columns = (handleEditClick, handleDeleteClick) => [
  { field: 'fullName', headerName: 'Full Name', width: 200 },
  { field: 'emailAddress', headerName: 'Email Address', width: 200 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
  { field: 'dob', headerName: 'Date of Birth', width: 150 },
  { field: 'country', headerName: 'Country', width: 120 },
  { field: 'state', headerName: 'State', width: 120 },
  { field: 'city', headerName: 'City', width: 120 },
  { field: 'address', headerName: 'Address', width: 200 },
  { field: 'zipCode', headerName: 'Zip Code', width: 120 },
  { field: 'company', headerName: 'Company', width: 150 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 110,
    renderCell: params => (
      <>
        <IconButton onClick={() => handleEditClick(params.id)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteClick(params.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
]

export default function CustomersTable() {
  const [searchText, setSearchText] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    dob: '',
    country: 'India',
    state: '',
    city: '',
    address: '',
    zipCode: '',
    company: '',
  })
  const [categories, setCategories] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentCustomerId, setCurrentCustomerId] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers')
      setRows(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSearch = event => {
    const value = event.target.value.toLowerCase()
    setSearchText(value)
  }

  const filteredRows = rows.filter(row =>
    (row.fullName && row.fullName.toLowerCase().includes(searchText)) ||
    (row.emailAddress && row.emailAddress.toLowerCase().includes(searchText)) ||
    (row.phoneNumber && row.phoneNumber.toString().includes(searchText)) ||
    (row.dob && row.dob.toString().includes(searchText)) ||
    (row.country && row.country.toLowerCase().includes(searchText)) ||
    (row.state && row.state.toLowerCase().includes(searchText)) ||
    (row.city && row.city.toLowerCase().includes(searchText)) ||
    (row.address && row.address.toLowerCase().includes(searchText)) ||
    (row.zipCode && row.zipCode.toString().includes(searchText)) ||
    (row.company && row.company.toLowerCase().includes(searchText))
  );
  
  const handleOpenDialog = () => {
    setIsEditing(false)
    setFormData({
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      dob: '',
      country: 'India',
      state: '',
      city: '',
      address: '',
      zipCode: '',
      company: '',
    })
    setOpenDialog(true)
  }

  const handleEditClick = id => {
    const customer = rows.find(row => row.id === id)
    setFormData({
      fullName: customer.fullName,
      emailAddress: customer.emailAddress,
      phoneNumber: customer.phoneNumber,
      dob: customer.dob,
      country: customer.country,
      state: customer.state,
      city: customer.city,
      address: customer.address,
      zipCode: customer.zipCode,
      company: customer.company,
    })
    setIsEditing(true)
    setCurrentCustomerId(id)
    setOpenDialog(true)
  }

  const handleDeleteClick = id => {
    setCurrentCustomerId(id)
    setConfirmDeleteOpen(true)
  }

  const handleCreateOrUpdateCustomer = async () => {
    try {
      console.log('Sending data:', formData)
      let response
      if (isEditing) {
        response = await api.put(`/customers/${currentCustomerId}`, formData)
        console.log('Update response:', response)
        setAlertMessage('Customer updated successfully!')
      } else {
        response = await api.post('/customers', formData)
        console.log('Create response:', response)
        setAlertMessage('Customer added successfully!')
      }
      setAlertSeverity('success')
      fetchCustomers()
    } catch (error) {
      setAlertMessage('Failed to add/update customer')
      setAlertSeverity('error')
      console.error('Error adding/updating customer:', error)
    }
    setAlertOpen(true)
    setOpenDialog(false)
  }

  const handleDeleteConfirm = async () => {
    try {
      console.log('Deleting customer with id:', currentCustomerId)
      const response = await api.delete(`/customers/${currentCustomerId}`)
      console.log('Delete response:', response)
      setAlertMessage('Customer deleted successfully!')
      setAlertSeverity('success')
      fetchCustomers()
    } catch (error) {
      setAlertMessage('Failed to delete customer')
      setAlertSeverity('error')
      console.error('Error deleting customer:', error)
    }
    setAlertOpen(true)
    setConfirmDeleteOpen(false)
  }

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlertOpen(false)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const stateMenuItems = getStateMenuItems()

  return (
    <Container sx={{ height: 400, width: '100%', backgroundColor: '#f5f5f5', padding: 2 }}>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={5}>
        <Typography variant='h4' component='h2' gutterBottom>
          Customers
        </Typography>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Customer
        </Button>
      </Stack>

      <OutlinedInput
        sx={{ marginBottom: 1.5 }}
        onChange={handleSearch}
        placeholder='Search customers...'
        startAdornment={
          <InputAdornment position='start'>
            <Iconify
              icon='eva:search-fill'
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />

      <div style={{ height: 400, width: '100%' }}>
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
        ) : filteredRows.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <AiOutlineShopping style={{ fontSize: '48px' }} />
              <Typography variant='body1' style={{ marginTop: '10px' }}>
                No customers found.
              </Typography>
            </div>
          </div>
        ) : (
          <DataGrid
            rows={filteredRows}
            columns={columns(handleEditClick, handleDeleteClick)}
            pageSize={5}
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Full Name'
                name='fullName'
                value={formData.fullName}
                onChange={handleInputChange}
                variant='outlined'
               
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Email Address'
                name='emailAddress'
                value={formData.emailAddress}
                onChange={handleInputChange}
                variant='outlined'
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Phone Number'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleInputChange}
                variant='outlined'
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='date'
                label='Date of Birth'
                name='dob'
                value={formData.dob}
                onChange={handleInputChange}
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Country'
                name='country'
                value={formData.country}
                onChange={handleInputChange}
                variant='outlined'
                sx={{ marginBottom: 2 }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label='State'
                name='state'
                value={formData.state}
                onChange={handleInputChange}
                variant='outlined'
                sx={{ marginBottom: 2 }}
              >
                {stateMenuItems.map(state => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='City'
                name='city'
                value={formData.city}
                onChange={handleInputChange}
                variant='outlined'
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Address'
                name='address'
                value={formData.address}
                onChange={handleInputChange}
                variant='outlined'
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Zip Code'
                name='zipCode'
                value={formData.zipCode}
                onChange={handleInputChange}
                variant='outlined'
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Company'
                name='company'
                value={formData.company}
                onChange={handleInputChange}
                variant='outlined'
                sx={{ marginBottom: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateOrUpdateCustomer} color='primary' variant='contained'>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Are you sure you want to delete this customer?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='primary' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={handleAlertClose}
          severity={alertSeverity}
        >
          <AlertTitle>{alertSeverity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}
