import React, { useState, useEffect, useCallback } from 'react'
import { MdAdd as AddIcon, MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md'
import { DataGrid } from '@mui/x-data-grid'
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
  FormControl,
  InputLabel,
  Select,
  Toolbar,
} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import axios from 'axios'
import { Container } from '@mui/system'
import SvgColor from 'src/components/svg-color'



const ResolutionsTable = () => {
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

// Create loggedInUser variable
const loggedInUser = userDetails ? `${userDetails.first_name} ${userDetails.last_name}` : '';

// Example of how to use it
console.log('Logged In User:', loggedInUser);
  // Get userDetails from localStorage


  const [complaints, setComplaints] = useState([])
  const [resolutions, setResolutions] = useState([])
  const [searchText, setSearchText] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleteResolutionId, setDeleteResolutionId] = useState(null)
  const [newResolution, setNewResolution] = useState({
    id: null,
    complaint_id: '',
    resolution_date: new Date().toISOString().split('T')[0],
    resolved_by: loggedInUser,
    resolution_description: '',
    resolution_status: 'Pending',
    complaint_name: '', // Add this field
  })

  const [isEditing, setIsEditing] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  useEffect(() => {
    
    fetchResolutions()
  }, [])

  const api = import.meta.env.VITE_API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${api}/complaints`)
        const options = response.data.map(complaint => ({
          value: complaint.id,
          label: `${complaint.customer_name} - ${complaint.title}`,
        }))
        setComplaints(options)
      } catch (error) {
        console.error('Error fetching complaints:', error)
      }
    }

    fetchComplaints()
  }, [])

  const fetchResolutions = async () => {
    try {
      const response = await axios.get(`${api}/resolutions`)
      setResolutions(response.data)
    } catch (error) {
      console.error('Error fetching resolutions:', error.message)
    }
  }

  const handleSearch = e => {
    setSearchText(e.target.value)
  }

  const filteredResolutions = resolutions.filter(
    resolution =>
      (resolution.complaint_name &&
        resolution.complaint_name.toLowerCase().includes(searchText.toLowerCase())) ||
      (resolution.resolution_date &&
        resolution.resolution_date.toLowerCase().includes(searchText.toLowerCase())) ||
      (resolution.resolution_description &&
        resolution.resolution_description.toLowerCase().includes(searchText.toLowerCase()))
  )

  const handleCreateOrUpdateResolution = async () => {
    if (!newResolution.complaint_id || !newResolution.resolution_description.trim()) {
      handleSnackbarOpen('Please enter both customer name and resolution description.', 'error')
      return
    }

    try {
      const complaint = complaints.find(c => c.value === newResolution.complaint_id)
      if (complaint) {
        newResolution.complaint_name = complaint.label
      }

      let response
      if (isEditing) {
        response = await axios.put(`${api}/resolutions/${newResolution.id}`, newResolution)
        setResolutions(
          resolutions.map(resolution =>
            resolution.id === newResolution.id ? response.data : resolution
          )
        )
        handleSnackbarOpen('Resolution updated successfully.', 'success')
      } else {
        response = await axios.post(`${api}/resolutions`, newResolution)
        setResolutions([...resolutions, response.data])
        handleSnackbarOpen('Resolution created successfully.', 'success')
      }

      setOpenDialog(false)
      setNewResolution({
        id: null,
        complaint_id: '',
        resolution_date: new Date().toISOString().split('T')[0],
        resolved_by: loggedInUser,
        resolution_description: '',
        resolution_status: 'Pending',
        complaint_name: '',
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving resolution:', error.message)
      handleSnackbarOpen('Error saving resolution. Please try again.', 'error')
    }
  }

  const handleEditClick = useCallback(resolution => {
    setNewResolution(resolution)
    setIsEditing(true)
    setOpenDialog(true)
  }, [])

  const handleDeleteClick = useCallback(id => {
    setDeleteResolutionId(id)
    setConfirmDeleteOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await axios.delete(`${api}/resolutions/${deleteResolutionId}`)
      setResolutions(resolutions.filter(resolution => resolution.id !== deleteResolutionId))
      handleSnackbarOpen('Resolution deleted successfully.', 'success')
    } catch (error) {
      console.error('Error deleting resolution:', error.message)
      handleSnackbarOpen('Error deleting resolution. Please try again.', 'error')
    } finally {
      setConfirmDeleteOpen(false)
      setDeleteResolutionId(null)
    }
  }, [resolutions, deleteResolutionId])

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

  const filteredResolutionsWithDates = filteredResolutions.map(resolution => ({
    ...resolution,
    resolution_date: new Date(resolution.resolution_date),
  }))

  const columns = [
    { field: 'complaint_name', headerName: 'Complaint Name', width: 220, editable: true },
    {
      field: 'resolution_date',
      headerName: 'Resolution Date',
      width: 130,
      editable: true,
      type: 'date',
    },
    { field: 'resolved_by', headerName: 'Resolved By', width: 130, editable: true },
    {
      field: 'resolution_description',
      headerName: 'Resolution Description',
      width: 200,
      editable: true,
    },
    { field: 'resolution_status', headerName: 'Resolution Status', width: 130, editable: true },
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

  return (
    <Container>
      {/* <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant='h4'>
        <SvgColor
            src={`/assets/icons/navbar/ic_offer.svg`}
            sx={{ width: 50, height: 30, marginRight: 2 }}
          />
        Resolutions</Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            setNewResolution({
              id: null,
              complaint_id: '',
              resolution_date: new Date().toISOString().split('T')[0],
              resolved_by: loggedInUser,
              resolution_description: '',
              resolution_status: 'Pending',
              complaint_name: '',
            })
            setIsEditing(false)
            setOpenDialog(true)
          }}
        >
          Add New Resolution
        </Button>
      </div> */}

      <Toolbar>
        <Typography variant='h4' style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <SvgColor
            src={`/assets/icons/navbar/ic_resolution.svg`}
            sx={{ width: 50, height: 30, marginRight: 2 }}
          />
          Resolutions
        </Typography>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<AddIcon />}
          onClick={() => {
            setNewResolution({
              id: null,
              complaint_id: '',
              resolution_date: new Date().toISOString().split('T')[0],
              resolved_by: loggedInUser,
              resolution_description: '',
              resolution_status: 'Pending',
              complaint_name: '',
            })
            setIsEditing(false)
            setOpenDialog(true)
          }}
          style={{ marginLeft: 'auto' }}
        >
          Add New Resolution
        </Button>
      </Toolbar>
      <div style={{ marginBottom: '16px' }}>
        <TextField
          label='Search'
          value={searchText}
          onChange={handleSearch}
          placeholder='Search...'
        />
      </div>
      <div style={{ height: 400, width: '100%' }}>
        {filteredResolutions.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>No resolutions found</div>
        ) : (
          <DataGrid rows={filteredResolutionsWithDates} columns={columns} pageSize={5} />
        )}
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Resolution' : 'Add New Resolution'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{top:10}}>Complaint</InputLabel>
                <Select
                  value={newResolution.complaint_id}
                  onChange={e =>
                    setNewResolution({ ...newResolution, complaint_id: e.target.value })
                  }
                >
                  {complaints.map(complaint => (
                    <MenuItem key={complaint.value} value={complaint.value}>
                      {complaint.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Resolution Date'
                type='date'
                value={newResolution.resolution_date}
                onChange={e =>
                  setNewResolution({ ...newResolution, resolution_date: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Resolved By'
                value={newResolution.resolved_by}
                onChange={e => setNewResolution({ ...newResolution, resolved_by: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Resolution Description'
                multiline
                rows={4}
                value={newResolution.resolution_description}
                onChange={e =>
                  setNewResolution({ ...newResolution, resolution_description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label='Resolution Status'
                value={newResolution.resolution_status}
                onChange={e =>
                  setNewResolution({ ...newResolution, resolution_status: e.target.value })
                }
              >
                <MenuItem value={'Pending'}>Pending</MenuItem>
                <MenuItem value={'Resolved'}>Resolved</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateOrUpdateResolution} color='primary' variant='contained'>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Are you sure you want to delete this resolution?</Typography>
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

export default ResolutionsTable
