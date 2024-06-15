import React, { useState, useEffect, useCallback } from 'react'
import { MdAdd as AddIcon, MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Snackbar,
  Slide,
  MenuItem,
  Toolbar,
} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import axios from 'axios'
import { Container } from '@mui/system'
import SvgColor from 'src/components/svg-color'

const api = import.meta.env.VITE_API

const columns = (handleEditClick, handleDeleteClick) => [
  { field: 'customer_name', headerName: 'Customer Name', width: 180 },
  { field: 'complaint_date', headerName: 'Complaint Date', width: 130, type: 'date' },
  { field: 'complaint_type', headerName: 'Complaint Type', width: 130 },
  { field: 'title', headerName: 'Complaint Name', width: 180 },
  { field: 'description', headerName: 'Description', width: 235 },
  { field: 'status', headerName: 'Status', width: 130 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: params => (
      <>
        <IconButton onClick={() => handleEditClick(params.row)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteClick(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
]

const ComplaintsTable = () => {
  const [complaints, setComplaints] = useState([])
  const [searchText, setSearchText] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleteComplaintId, setDeleteComplaintId] = useState(null)
  const [newComplaint, setNewComplaint] = useState({
    id: null,
    customer_name: '',
    complaint_date: new Date().toISOString().split('T')[0],
    complaint_type: '',
    title: '',
    description: '',
    status: 'Pending',
  })

  //data for fetching the customer names
  const [customerNames, setCustomerNames] = useState([])

  useEffect(() => {
    fetchCustomerNames()
  }, [])

  const fetchCustomerNames = async () => {
    try {
      const response = await axios.get(`${api}/customers`)
      const names = response.data.map(customer => customer.full_name)
      setCustomerNames(names)
    } catch (error) {
      console.error('Error fetching customer names:', error.message)
    }
  }
  const [isEditing, setIsEditing] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${api}/complaints`)
      setComplaints(response.data)
    } catch (error) {
      console.error('Error fetching complaints:', error.message)
    }
  }

  const handleSearch = e => {
    setSearchText(e.target.value)
  }

  const filteredComplaints = complaints.filter(
    complaint =>
      (complaint.customer_name &&
        complaint.customer_name.toLowerCase().includes(searchText.toLowerCase())) ||
      (complaint.complaint_date &&
        complaint.complaint_date.toLowerCase().includes(searchText.toLowerCase())) ||
      (complaint.description &&
        complaint.description.toLowerCase().includes(searchText.toLowerCase()))
  )

  const handleCreateOrUpdateComplaint = async () => {
    if (!newComplaint.customer_name.trim() || !newComplaint.description.trim()) {
      handleSnackbarOpen('Please enter both customer name and description.', 'error')
      return
    }

    try {
      let response
      if (isEditing) {
        response = await axios.put(`${api}/complaints/${newComplaint.id}`, newComplaint)
        setComplaints(
          complaints.map(complaint =>
            complaint.id === newComplaint.id ? response.data : complaint
          )
        )
        handleSnackbarOpen('Complaint updated successfully.', 'success')
      } else {
        response = await axios.post(`${api}/complaints`, newComplaint)
        setComplaints([...complaints, response.data])
        handleSnackbarOpen('Complaint created successfully.', 'success')
      }

      setOpenDialog(false)
      setNewComplaint({
        id: null,
        customer_name: '',
        complaint_date: new Date().toISOString().split('T')[0],
        complaint_type: '',
        title: '',
        description: '',
        status: 'Pending',
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving complaint:', error.message)
      handleSnackbarOpen('Error saving complaint. Please try again.', 'error')
    }
  }

  const handleEditClick = useCallback(complaint => {
    setNewComplaint(complaint)
    setIsEditing(true)
    setOpenDialog(true)
  }, [])

  const handleDeleteClick = useCallback(id => {
    setDeleteComplaintId(id)
    setConfirmDeleteOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await axios.delete(`${api}/complaints/${deleteComplaintId}`)
      setComplaints(complaints.filter(complaint => complaint.id !== deleteComplaintId))
      handleSnackbarOpen('Complaint deleted successfully.', 'success')
    } catch (error) {
      console.error('Error deleting complaint:', error.message)
      handleSnackbarOpen('Error deleting complaint. Please try again.', 'error')
    } finally {
      setConfirmDeleteOpen(false)
      setDeleteComplaintId(null)
    }
  }, [complaints, deleteComplaintId])

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const filteredComplaintsWithDates = filteredComplaints.map(complaint => ({
    ...complaint,
    complaint_date: new Date(complaint.complaint_date),
  }))
  const complaintTypes = [
    'Service Quality',
    'Billing Issue',
    'Technical Support',
    'Product Quality',
    'Delivery Issue',
    'Refund Request',
    'Website/App Issue',
    'Account Issue',
    'Policy Issue',
    'Security Concern',
    'Shipping Issue',
    'Performance Issue',
    'Compatibility Issue',
    'Payment Issue',
    'User Interface Issue',
    'Data Security Issue',
    'Privacy Concern',
    'Upgrade Issue',
    'Installation Issue',
    'Network Issue',
    'Login Issue',
    'Registration Issue',
    'Subscription Issue',
    'Feedback',
    'Other',
  ];
  
  const handleChange = e => {
    setNewComplaint({ ...newComplaint, complaint_type: e.target.value })
  }

  return (
    <Container>
     <Toolbar>
  <div
    style={{
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%', // Added to ensure full width alignment
    }}
  >
    <SvgColor
      src={`/assets/icons/navbar/ic_complaint.svg`}
      sx={{ width: 50, height: 40, marginRight: 2 }}
    />
    <Typography variant='h4' style={{ flex: 1 }}>
      Customer Complaints
    </Typography>
    <Button
      variant='contained'
      color='inherit'
      startIcon={<AddIcon />}
      onClick={() => {
        setNewComplaint({
          id: null,
          customer_name: '',
          complaint_date: new Date().toISOString().split('T')[0],
          complaint_type: '',
          title: '',
          description: '',
          status: 'Pending',
        });
        setIsEditing(false);
        setOpenDialog(true);
      }}
    >
      Add New Complaint
    </Button>
  </div>
</Toolbar>


      <div style={{ marginBottom: '16px' }}>
        <TextField
          label='Search Complaints..'
          value={searchText}
          onChange={handleSearch}
          placeholder='Search Complaints...'
        />
      </div>

      <div style={{ height: 400, width: '100%' }}>
        {filteredComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>No complaints found</div>
        ) : (
          <DataGrid
            rows={filteredComplaintsWithDates}
            columns={columns(handleEditClick, handleDeleteClick)}
            pageSize={5}
          />
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Complaint' : 'Add New Complaint'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label='Customer Name'
                value={newComplaint.customer_name}
                onChange={e => setNewComplaint({ ...newComplaint, customer_name: e.target.value })}
                sx={{ top: 5 }}
              >
                {customerNames.map(name => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Complaint Date'
                type='date'
                value={newComplaint.complaint_date}
                onChange={e => setNewComplaint({ ...newComplaint, complaint_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label='Complaint Type'
                value={newComplaint.complaint_type}
                onChange={handleChange}
              >
                {complaintTypes.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Complaint Name'
                value={newComplaint.title}
                onChange={e => setNewComplaint({ ...newComplaint, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Description'
                multiline
                rows={4}
                value={newComplaint.description}
                onChange={e => setNewComplaint({ ...newComplaint, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label='Status'
                value={newComplaint.status}
                onChange={e => setNewComplaint({ ...newComplaint, status: e.target.value })}
              >
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='Resolved'>Resolved</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateOrUpdateComplaint} color='primary' variant='contained'>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Are you sure you want to delete this complaint?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='primary' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Slide}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

export default ComplaintsTable
