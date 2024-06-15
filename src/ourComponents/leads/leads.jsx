import React, { useState, useEffect } from 'react'
import Iconify from 'src/components/iconify'

import { DataGrid, GridToolbar } from '@mui/x-data-grid'
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
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
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
import { MdAdd as AddIcon, MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md'

import api from 'src/utils/api' // Import the axios instance
import SvgColor from 'src/components/svg-color'
import Label from 'src/components/label'
import { Link as RouterLink } from 'react-router-dom'

function SlideTransition (props) {
  return <Slide {...props} direction='up' />
}

const columns = (handleEditClick, handleDeleteClick) => [
  { field: 'lead_name', headerName: 'Lead Name', width: 120 },
  { field: 'lead_type', headerName: 'Lead Type', width: 120 },
  { field: 'company_name', headerName: 'Company', width: 120 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone_number', headerName: 'Phone Number', width: 120 },
  { field: 'follow_up', headerName: 'FollowUp Date', width: 150, type: Date },

  { field: 'followup_description', headerName: 'FollowUp Remarks', width: 180 },
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

export default function LeadsTable () {
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
    lead_name: '',
    lead_type: '',
    company_name: '',
    email: '',
    phone_number: '',
    follow_up: new Date().toISOString().split('T')[0],
    followup_description: '',
  })

  const isLeadFormValid = () => {
    return (
      formData.lead_name &&
      formData.lead_type &&
      formData.company_name &&
      formData.email &&
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email) &&
      formData.phone_number &&
      /^\d{10}$/.test(formData.phone_number) &&
      formData.follow_up &&
      formData.followup_description
    )
  }

  const [leads, setLeads] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentLeadId, setCurrentLeadId] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  // const fetchLeads = async () => {
  //   try {

  //     const response = await api.get('/leads');
  //     setRows(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching leads:', error);
  //     setLoading(false);
  //   }
  // };
  const fetchLeads = async () => {
    try {
      const response = await api.get(`/leads`)
      const fetchedData = response.data.map(item => ({
        id: item.id,
        lead_name: item.lead_name,
        lead_type: item.lead_type,

        company_name: item.company_name,
        follow_up: new Date(item.follow_up),
        email: item.email,
        phone_number: item.phone_number,
        followup_description: item.followup_description,
      }))
      setRows(fetchedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching leads:', error)
      setLoading(false)
    }
  }
  const fetchLeadNames = async () => {
    try {
      const response = await api.get('/customers')
      setLeads(response.data)
    } catch (error) {
      console.error('Error fetching lead names:', error)
    }
  }

  useEffect(() => {
    fetchLeads()
    fetchLeadNames()
  }, [])

  const handleSearch = event => {
    const value = event.target.value.toLowerCase()
    setSearchText(value)
  }

  const filteredRows = rows.filter(
    row =>
      (row.lead_name && row.lead_name.toLowerCase().includes(searchText)) ||
      (row.lead_type && row.lead_type.toLowerCase().includes(searchText)) ||
      (row.company_name && row.company_name.toLowerCase().includes(searchText)) ||
      (row.email && row.email.toLowerCase().includes(searchText)) ||
      (row.phone_number && row.phone_number.toString().includes(searchText)) ||
      (row.follow_up && new Date(row.follow_up).toISOString().substring(0, 10).includes(searchText))
  )

  const handleOpenDialog = () => {
    setIsEditing(false)
    setFormData({
      lead_name: '',
      lead_type: '',
      company_name: '',
      email: '',
      phone_number: '',
      follow_up: null,
      followup_description: '',
    })
    setOpenDialog(true)
  }

  const handleEditClick = id => {
    const lead = rows.find(row => row.id === id)
    setFormData({
      lead_name: lead.lead_name,
      lead_type: lead.lead_type,
      company_name: lead.company_name,
      email: lead.email,
      phone_number: lead.phone_number,
      follow_up: lead.follow_up ? new Date(lead.follow_up) : null, // Handle null case here
      followup_description: lead.followup_description,
    })
    setIsEditing(true)
    setCurrentLeadId(id)
    setOpenDialog(true)
  }

  const handleDeleteClick = id => {
    setCurrentLeadId(id)
    setConfirmDeleteOpen(true)
  }

  const handleCreateOrUpdateLead = async () => {
    try {
      let response
      const dataToSend = { ...formData }

      // Convert follow_up date to ISO string format if it's a Date object
      if (formData.follow_up instanceof Date) {
        dataToSend.follow_up = formData.follow_up.toISOString().split('T')[0]
      } else {
        delete dataToSend.follow_up // Remove follow_up if it's null or not a Date object
      }

      if (isEditing) {
        response = await api.put(`/leads/${currentLeadId}`, dataToSend)
        setAlertMessage('Lead updated successfully!')
      } else {
        response = await api.post('/leads', dataToSend)
        setAlertMessage('Lead added successfully!')
      }
      setAlertSeverity('success')
      fetchLeads()
    } catch (error) {
      setAlertMessage('Failed to add/update lead')
      setAlertSeverity('error')
      console.error('Error adding/updating lead:', error)
    }
    setAlertOpen(true)
    setOpenDialog(false)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/leads/${currentLeadId}`)
      setAlertMessage('Lead deleted successfully!')
      setAlertSeverity('success')
      fetchLeads()
    } catch (error) {
      setAlertMessage('Failed to delete lead')
      setAlertSeverity('error')
      console.error('Error deleting lead:', error)
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

  const handleFollowUpDateChange = date => {
    setFormData(prevData => ({
      ...prevData,
      follow_up: date, // Store the Date object directly
    }))
  }

  const handleLeadNameChange = e => {
    const selectedLead = leads.find(lead => lead.full_name === e.target.value)
    setFormData({
      lead_name: selectedLead.full_name,
      lead_type: '',
      company_name: selectedLead.company,
      email: selectedLead.email_address,
      phone_number: selectedLead.phone_number,
      follow_up: null,
      followup_description: '',
    })
  }

  return (
    // <Container sx={{ height: 400, width: '100%', backgroundColor: '#f5f5f5', padding: 2 }}>
    <Container sx={{ height: 400, width: '100%', backgroundColor: '#f5f5f5', padding: 2 }}>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
        <Typography
          variant='h4'
          component='h2'
          gutterBottom
          style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        >
          <SvgColor
            src={`/assets/icons/navbar/ic_lead.svg`}
            sx={{ width: 50, height: 30, marginRight: 2 }}
          />
          Leads
        </Typography>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          style={{ marginLeft: 'auto' }}
        >
          Add Lead
        </Button>
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <OutlinedInput
          sx={{ marginBottom: 1.5 }}
          onChange={handleSearch}
          placeholder='Search Leads...'
          startAdornment={
            <InputAdornment position='start'>
              <Iconify
                icon='eva:search-fill'
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
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
      </div>
      <div style={{ height: 330, width: '100%' }}>
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
              <Typography variant='body1' style={{ marginTop: '10px' }}>
                No leads found.
              </Typography>
            </div>
          </div>
        ) : (
          <DataGrid
            // rows={filteredRows}
            // columns={columns(handleEditClick, handleDeleteClick)}
            // pageSize={5}
            // components={{ Toolbar: GridToolbar }}
            rows={filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
            columns={columns(handleEditClick, handleDeleteClick)}
            pageSize={rowsPerPage}
            onPageChange={params => setPage(params.page)}
            onPageSizeChange={params => setRowsPerPage(params.pageSize)}
            pagination
            components={{ Toolbar: GridToolbar }}
            autoHeight
            loading={loading}
          />
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        <Box display='flex' alignItems='center' ml={3}>
          <Typography variant='subtitle4' actionPosition='right' color='textSecondary'>
            If the customer is not listed here? please
          </Typography>
          <Button
            component={RouterLink}
            to='/customer'
            color='primary'
            size='small'
            sx={{ marginLeft: 0.2, textTransform: 'none', marginTop: 0.2 }}
          >
            Add New Customer
          </Button>
        </Box>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Select Customer Names'
                name='lead_name'
                value={formData.lead_name}
                onChange={handleLeadNameChange}
                select
                variant='outlined'
                required
                error={!formData.lead_name}
                helperText={!formData.lead_name ? 'Lead Name is required' : ''}
                sx={{ marginBottom: 2, top: 5 }}
              >
                {leads.map(lead => (
                  <MenuItem key={lead.id} value={lead.full_name}>
                    {lead.full_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Select Lead Type'
                name='lead_type'
                value={formData.lead_type}
                onChange={handleInputChange}
                select
                variant='outlined'
                required
                error={!formData.lead_type}
                helperText={!formData.lead_type ? 'Lead Type is required' : ''}
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value='Instagram'>Instagram</MenuItem>
                <MenuItem value='Facebook'>Facebook</MenuItem>
                <MenuItem value='Twitter'>Twitter</MenuItem>
                <MenuItem value='LinkedIn'>LinkedIn</MenuItem>
                <MenuItem value='Newspaper'>Newspaper</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Company Name'
                name='company_name'
                value={formData.company_name}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.company_name}
                helperText={!formData.company_name ? 'Company Name is required' : ''}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)}
                helperText={
                  !formData.email
                    ? 'Email is required'
                    : !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
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
                    ? 'Invalid Phone Number'
                    : ''
                }
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Follow Up Date'
                  value={formData.follow_up}
                  onChange={handleFollowUpDateChange}
                  renderInput={props => <TextField {...props} variant='outlined' fullWidth />}
                  required
                  error={!formData.follow_up}
                  helperText={!formData.follow_up ? 'Follow Up Date is required' : ''}
                  sx={{ marginBottom: 2 }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Follow Up Remarks'
                name='followup_description'
                value={formData.followup_description}
                onChange={handleInputChange}
                variant='outlined'
                multiline
                rows={4}
                required
                error={!formData.followup_description}
                helperText={
                  !formData.followup_description ? 'Follow Up Description is required' : ''
                }
                sx={{ marginBottom: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateOrUpdateLead}
            color='primary'
            variant='contained'
            disabled={!isLeadFormValid()}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Are you sure you want to delete this lead?</Typography>
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
