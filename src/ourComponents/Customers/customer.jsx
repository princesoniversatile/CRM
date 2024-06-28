import React, { useState, useEffect, useRef } from 'react'
import SvgColor from 'src/components/svg-color'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  root: {
    '&::-webkit-scrollbar': {
      display: 'none' /* Safari and Chrome */,
    },
    '-ms-overflow-style': 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */,
  },
}))
import Iconify from 'src/components/iconify'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { getStateMenuItems } from './menuProvider'
import { MdDashboardCustomize as ArrowDropDownIcon } from 'react-icons/md'
// import { MdMoreVert as ArrowDropDownIcon } from 'react-icons/md'

import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

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
  Toolbar,
  TablePagination,
  Checkbox,
  FormControlLabel,
  Menu,
  Fade,
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
import Label from 'src/components/label'
import { fontSize } from '@mui/system'

function SlideTransition (props) {
  return <Slide {...props} direction='up' />
}

const columns = (handleEditClick, handleDeleteClick) => [
  { field: 'full_name', headerName: 'Full Name', width: 150, isDefault: true },
  { field: 'company', headerName: 'Company', width: 180, isDefault: true },
  { field: 'email_address', headerName: 'Email Address', width: 230, isDefault: true },
  { field: 'phone_number', headerName: 'Phone Number', width: 150, isDefault: true },
  { field: 'dob', headerName: 'Date of Birth', width: 150 },
  { field: 'country', headerName: 'Country', width: 120 },
  { field: 'state', headerName: 'State', width: 120 },
  { field: 'city', headerName: 'City', width: 120 },
  { field: 'address', headerName: 'Address', width: 200 },
  { field: 'zip_code', headerName: 'Zip Code', width: 120 },
  // { field: 'created_date', headerName: 'Created Date', width: 120, type: Date },
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
    isDefault: true,
  },
]

export default function CustomersTable () {
  const classes = useStyles()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'))

  let gridHeight
  if (isSmallScreen) {
    gridHeight = 300
  } else if (isMediumScreen) {
    gridHeight = 300
  } else {
    gridHeight = 350
  }
  const [visibleColumns, setVisibleColumns] = useState(
    columns()
      .filter(col => col.isDefault)
      .map(col => col.field)
  )
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const handleColumnToggle = field => {
    setVisibleColumns(prev =>
      prev.includes(field) ? prev.filter(col => col !== field) : [...prev, field]
    )
  }

  const handleShowHideAll = () => {
    if (visibleColumns.length === columns().length) {
      setVisibleColumns(
        columns()
          .filter(col => col.isDefault)
          .map(col => col.field)
      )
    } else {
      setVisibleColumns(columns().map(col => col.field))
    }
  }

  const handleReset = () => {
    setVisibleColumns(
      columns()
        .filter(col => col.isDefault)
        .map(col => col.field)
    )
  }

  const handleClickOutside = event => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false)
    }
  }

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchText, setSearchText] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [formData, setFormData] = useState({
    full_name: '',
    email_address: '',
    phone_number: '',
    dob: '',
    country: 'India',
    state: '',
    city: '',
    address: '',
    zip_code: '',
    company: '',
  })
  const isFormValid = () => {
    return (
      formData.full_name &&
      formData.email_address &&
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email_address) &&
      formData.phone_number &&
      /^\d{10}$/.test(formData.phone_number) &&
      formData.dob &&
      formData.state &&
      formData.city &&
      formData.address &&
      formData.zip_code &&
      /^\d{6}$/.test(formData.zip_code) &&
      formData.company
    )
  }
  const [categories, setCategories] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentCustomerId, setCurrentCustomerId] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const fetchCustomers = async () => {
    // try {
    //   const response = await api.get('/customers')
    //   setRows(response.data)
    //   setLoading(false)
    // } catch (error) {
    //   console.error('Error fetching customers:', error)
    //   setLoading(false)
    // }
    try {
      const response = await api.get('/customers')
      const formattedData = response.data.map(customer => ({
        ...customer,
        dob: customer.dob ? new Date(customer.dob).toISOString().substring(0, 10) : '',
        created_date: customer.created_date
          ? new Date(customer.created_date).toISOString().substring(0, 10)
          : '',
      }))
      setRows(formattedData)
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

  const filteredRows = rows.filter(
    row =>
      (row.full_name && row.full_name.toLowerCase().includes(searchText)) ||
      (row.email_address && row.email_address.toLowerCase().includes(searchText)) ||
      (row.phone_number && row.phone_number.toString().includes(searchText)) ||
      (row.dob && row.dob.toString().includes(searchText)) ||
      (row.country && row.country.toLowerCase().includes(searchText)) ||
      (row.state && row.state.toLowerCase().includes(searchText)) ||
      (row.city && row.city.toLowerCase().includes(searchText)) ||
      (row.address && row.address.toLowerCase().includes(searchText)) ||
      (row.zip_code && row.zip_code.toString().includes(searchText)) ||
      (row.company && row.company.toLowerCase().includes(searchText))
  )

  const handleOpenDialog = () => {
    setIsEditing(false)
    setFormData({
      full_name: '',
      email_address: '',
      phone_number: '',
      dob: '',
      country: 'India',
      state: '',
      city: '',
      address: '',
      zip_code: '',
      company: '',
    })
    setOpenDialog(true)
  }

  const handleEditClick = id => {
    const customer = rows.find(row => row.id === id)
    setFormData({
      full_name: customer.full_name,
      email_address: customer.email_address,
      phone_number: customer.phone_number,
      dob: customer.dob,
      country: customer.country,
      state: customer.state,
      city: customer.city,
      address: customer.address,
      zip_code: customer.zip_code,
      company: customer.company,
      created_date: new Date(customer.created_date),
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
  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside (event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])
  const handleToggle = () => {
    setOpen(!open) // Toggle the open state
  }

  return (
    <Container
      className={classes.root}
      fixed
      sx={{ backgroundColor: '#f5f5f5', height: '300px !important' }}
    >
      <Toolbar>
        <Typography variant='h4' style={{ display: 'flex', alignItems: 'center' }}>
          <SvgColor
            src={`/assets/icons/navbar/ic_customer2.svg`}
            sx={{ width: 50, height: 40, mr: 2 }}
          />
          Customers
        </Typography>
        <Button
          sm={5}
          variant='contained'
          color='inherit'
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          style={{ marginLeft: 'auto' }}
        >
          Add Customer
        </Button>
      </Toolbar>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <OutlinedInput
          // sx={{ marginBottom: 1.5 }}
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
        <Box sx={{ position: 'relative' }}>
          <IconButton onClick={handleToggle} sx={{ display: 'flex', alignItems: 'center' }}>
            <ArrowDropDownIcon />
            <Label variant='ghost'>Customize View..</Label>
          </IconButton>
          {open && (
            <Fade in={open} timeout={300}>
              <Box
                position='absolute'
                top={10}
                right={140}
                bgcolor='background.paper'
                boxShadow={5}
                borderRadius={1}
                zIndex={7}
                ref={menuRef}
                minWidth='172px' // Ensure a minimum width
                sx={{
                  overflowY: 'auto', // Enable vertical scrolling
                  maxHeight: 'calc(100vh - 100px)', // Adjust this value to fit within the screen height
                  // transition: '3s ease-in-out',
                }}
              >
                {columns(handleEditClick, handleDeleteClick).map(col => (
                  <Box
                    key={col.field}
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    pb={0.1}
                    pl={1}
                  >
                    <label>
                      <Checkbox
                        checked={visibleColumns.includes(col.field)}
                        onChange={() => handleColumnToggle(col.field)}
                        size='small' // Use small size for consistency
                        sx={{ mx: 0 }}
                      />
                      <Label>{col.headerName}</Label>
                    </label>
                  </Box>
                ))}
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                  <Button onClick={handleShowHideAll} size='small' sx={{ minWidth: '45%' }}>
                    Show/Hide
                  </Button>
                  <Button onClick={handleReset} size='small' sx={{ minWidth: '45%' }}>
                    Reset
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}
        </Box>
      </div>
      <TablePagination
        position='right'
        page={page}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPageOptions={[5, 10, 25, 50, 70]}
        onRowsPerPageChange={event => {
          setRowsPerPage(parseInt(event.target.value, 10))
          setPage(0)
        }}
      />
      <div
        style={{
          height: '300px',
          width: '100%',
          overflow: 'hidden',
          overflowX: 'auto',
          overflowY: 'auto',
        }}
      >
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
              <Typography variant='body1' style={{ marginTop: '20px' }}>
                No customers found.
              </Typography>
            </div>
          </div>
        ) : (
          <DataGrid
            rows={filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
            columns={columns(handleEditClick, handleDeleteClick).filter(col =>
              visibleColumns.includes(col.field)
            )}
            // columns={columns(handleEditClick, handleDeleteClick)}
            pageSize={rowsPerPage}
            onPageChange={params => setPage(params.page)}
            onPageSizeChange={params => setRowsPerPage(params.pageSize)}
            pagination
            components={{ Toolbar: GridToolbar }}
            // autoHeight
            density='compact' // Compact density to show more data
            height={gridHeight} // Set a fixed height for the DataGrid
            autoHeight={false} // Ensure autoHeight is set to false
            pageSizeOptions={[5, 10, 15, 1000]}
            loading={loading}
            sx={{
              '& .MuiDataGrid-root': {
                margin: 'dense', // Apply dense margin
              },
              '& .MuiDataGrid-cell': {
                padding: '4px', // Reduce cell padding to fit more data
              },
              '& .MuiDataGrid-columnHeaders': {
                fontSize: '0.85rem', // Reduce font size for headers
              },
              '& .MuiDataGrid-row': {
                minHeight: '40px', // Reduce row height to fit more rows
              },
            }}
          />
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customers'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Full Name'
                name='full_name'
                value={formData.full_name}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.full_name}
                helperText={!formData.full_name ? 'Full Name is required' : ''}
                sx={{ marginBottom: 2, top: 5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Email Address'
                name='email_address'
                value={formData.email_address}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={
                  !formData.email_address ||
                  !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email_address)
                }
                helperText={
                  !formData.email_address
                    ? 'Email Address is required'
                    : !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email_address)
                    ? 'Invalid Email Address'
                    : ''
                }
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Phone Number'
                name='phone_number'
                value={formData.phone_number}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.phone_number || !/^\d{10}$/.test(formData.phone_number)}
                helperText={
                  !formData.phone_number
                    ? 'Phone Number is required'
                    : !/^\d{10}$/.test(formData.phone_number)
                    ? 'Please Enter 10 Digit Valid Phone Number '
                    : ''
                }
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
                required
                error={!formData.dob || new Date(formData.dob) > new Date('2006-12-31')}
                helperText={
                  !formData.dob
                    ? 'Date of Birth is required'
                    : new Date(formData.dob) > new Date('2006-12-31')
                    ? 'Please enter a Date of Birth before December 31, 2006'
                    : ''
                }
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
                required
                error={!formData.state}
                helperText={!formData.state ? 'State is required' : ''}
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
                required
                error={!formData.city}
                helperText={!formData.city ? 'City is required' : ''}
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
                required
                error={!formData.address}
                helperText={!formData.address ? 'Address is required' : ''}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Zip Code'
                name='zip_code'
                value={formData.zip_code}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.zip_code || !/^\d{6}$/.test(formData.zip_code)}
                helperText={
                  !formData.zip_code
                    ? 'Zip Code is required'
                    : !/^\d{6}$/.test(formData.zip_code)
                    ? 'Invalid Zip Code'
                    : ''
                }
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
                required
                error={!formData.company}
                helperText={!formData.company ? 'Company is required' : ''}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateOrUpdateCustomer}
            color='primary'
            variant='contained'
            disabled={!isFormValid()}
          >
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
