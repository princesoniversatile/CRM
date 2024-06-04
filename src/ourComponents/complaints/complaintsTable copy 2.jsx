import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd as AddIcon, MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Snackbar, Slide, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { Container } from '@mui/system';
const apiUrl=import.meta.env.VITE_API
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
};

const columns = (handleEditClick, handleDeleteClick) => [
  { field: 'customer_name', headerName: 'Customer Name', width: 180, editable: true },
  { field: 'complaint_date', headerName: 'Complain Date', width: 130, editable: true, type: 'date' },
  {
    field: 'complaint_type',
    headerName: 'Complaint Type',
    width: 130,
    editable: true,
    type: 'singleSelect'
  },
  { field: 'title', headerName: 'Title', width: 130, editable: true },
  { field: 'description', headerName: 'Description', width: 200, editable: true },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    editable: true,
    type: 'singleSelect'
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
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
];

const ProductComplaintsTable = () => {
  const [complaints, setComplaints] = useState([]);
  console.log(complaints);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteComplaintsId, setDeleteComplaintsId] = useState(null);
  const [newComplaints, setNewComplaints] = useState({
    id: null,
    customer_name: '',
    complaint_date: new Date().toISOString().split('T')[0],
    complaint_type: '',
    title: '',
    description: '',
    status: 'pending'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${apiUrl}/complaints`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
    complaint.complaint_date ||
    complaint.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCreateOrUpdateComplaints = async () => {
    if (!newComplaints.customer_name.trim() || !newComplaints.description.trim()) {
      handleSnackbarOpen('Please enter both customer name and description.', 'error');
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${apiUrl}/complaints/${newComplaints.id}`, newComplaints);
        setComplaints(complaints.map(complaint => (complaint.id === newComplaints.id ? response.data : complaint)));
        handleSnackbarOpen('Complaint updated successfully.', 'success');
      } else {
        response = await axios.post('${apiUrl}/complaints', newComplaints);
        setComplaints([...complaints, response.data]);
        handleSnackbarOpen('Complaint created successfully.', 'success');
      }

      setOpenDialog(false);
      setNewComplaints({ id: null, customer_name: '', complaint_date: new Date().toISOString().split('T')[0], complaint_type: 'warranty', title: '', description: '', status: 'pending' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving complaint:', error.message);
      handleSnackbarOpen('Error saving complaint. Please try again.', 'error');
    }
  };

  // const handleEditClick = useCallback((complaint) => {
  //   setNewComplaints(complaint);
  //   setIsEditing(true);
  //   setOpenDialog(true);
  // }, []);
  const handleEditClick = useCallback((complaint) => {
    const formattedComplaint = {
      ...complaint,
      complaint_date: formatDate(complaint.complaint_date)
    };
    setNewComplaints(formattedComplaint);
    setIsEditing(true);
    setOpenDialog(true);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setDeleteComplaintsId(id);
    setConfirmDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await axios.delete(`${apiUrl}/complaints/${deleteComplaintsId}`);
      setComplaints(complaints.filter(complaint => complaint.id !== deleteComplaintsId));
      handleSnackbarOpen('Complaint deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting complaint:', error.message);
      handleSnackbarOpen('Error deleting complaint. Please try again.', 'error');
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteComplaintsId(null);
    }
  }, [complaints, deleteComplaintsId]);

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  const filteredComplaintsWithDates = filteredComplaints.map(complaint => ({
    ...complaint,
    complaint_date: new Date(complaint.complaint_date),
  }));

  return (
    <Container>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">Product Complaints</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setNewComplaints({ id: null, customer_name: '', complaint_date: new Date().toISOString().split('T')[0], complaint_type: '', title: '', description: '', status: 'Pending' });
            setIsEditing(false);
            setOpenDialog(true);
          }}
        >
          Add New Complaint
        </Button>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <TextField
          label="Search"
          value={searchText}
          onChange={handleSearch}
          placeholder='Search...'
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
        <DialogTitle >{isEditing ? 'Edit Complaint' : 'Add New Complaint'}</DialogTitle>
        <DialogContent >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newComplaints.customer_name}
                onChange={(e) => setNewComplaints({ ...newComplaints, customer_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Complaint Date"
                type="date"
                value={newComplaints.complaint_date}
                onChange={(e) => setNewComplaints({ ...newComplaints, complaint_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              select
                fullWidth
                label="Complaint Type"
                value={newComplaints.complaint_type}
                onChange={(e) => setNewComplaints({ ...newComplaints, complaint_type: e.target.value })}
              >
            
                <MenuItem value={'Claim'}>Claim</MenuItem>
                <MenuItem value={'Warranty '}>Warranty</MenuItem>
                <MenuItem value={'Repair'}>Repair</MenuItem>
                <MenuItem value={'Others'}>Others</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newComplaints.title}
                onChange={(e) => setNewComplaints({ ...newComplaints, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={newComplaints.description}
                onChange={(e) => setNewComplaints({ ...newComplaints, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Status"
                value={newComplaints.status}
                onChange={(e) => setNewComplaints({ ...newComplaints, status: e.target.value })}
              >
                <MenuItem value={'pending'}>Pending</MenuItem>
                <MenuItem value={'resolved'}>Resolved</MenuItem>
                <MenuItem value={'in progress'}>In Progress</MenuItem>
              </TextField>

            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateOrUpdateComplaints} color="primary" variant="contained">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this complaint?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="primary" variant="contained">
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
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container >
  );
};

export default ProductComplaintsTable;

