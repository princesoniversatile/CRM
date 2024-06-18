import React, { useState, useEffect, useRef } from 'react';
import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getStateMenuItems } from './menuProvider';
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
  // Label,
} from '@mui/material';
import {
  Container,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { AiOutlineShopping } from 'react-icons/ai';
import api from 'src/utils/api';
import { MdAdd as AddIcon, MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md';
import { MdMoreVert as ArrowDropDownIcon } from "react-icons/md";

// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function SlideTransition(props) {
  return <Slide {...props} direction='up' />;
}

const getColumns = (handleEditClick, handleDeleteClick) => [
  { field: 'full_name', headerName: 'Full Name', width: 150, isDefault: true },
  { field: 'company', headerName: 'Company', width: 150, isDefault: true },
  { field: 'email_address', headerName: 'Email Address', width: 200, isDefault: true },
  { field: 'phone_number', headerName: 'Phone Number', width: 150, isDefault: true },
  { field: 'dob', headerName: 'Date of Birth', width: 150 },
  { field: 'country', headerName: 'Country', width: 120 },
  { field: 'state', headerName: 'State', width: 120 },
  { field: 'city', headerName: 'City', width: 120 },
  { field: 'address', headerName: 'Address', width: 200 },
  { field: 'zip_code', headerName: 'Zip Code', width: 120 },
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
];

export default function CustomersTable() {
  const [visibleColumns, setVisibleColumns] = useState(getColumns().filter(col => col.isDefault).map(col => col.field));
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleColumnToggle = (field) => {
    setVisibleColumns(prev => prev.includes(field) ? prev.filter(col => col !== field) : [...prev, field]);
  };

  const handleShowHideAll = () => {
    if (visibleColumns.length === getColumns().length) {
      setVisibleColumns(getColumns().filter(col => col.isDefault).map(col => col.field));
    } else {
      setVisibleColumns(getColumns().map(col => col.field));
    }
  };

  const handleReset = () => {
    setVisibleColumns(getColumns().filter(col => col.isDefault).map(col => col.field));
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
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
  });

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
    );
  };

  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      const formattedData = response.data.map(customer => ({
        ...customer,
        dob: customer.dob ? new Date(customer.dob).toISOString().substring(0, 10) : '',
        created_date: customer.created_date ? new Date(customer.created_date).toISOString().substring(0, 10) : '',
      }));
      setRows(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = event => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
  };

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
  );

  const handleOpenDialog = () => {
    setIsEditing(false);
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
    });
    setOpenDialog(true);
  };

  const handleEditClick = id => {
    const customer = rows.find(row => row.id === id);
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
    });
    setIsEditing(true);
    setCurrentCustomerId(id);
    setOpenDialog(true);
  };

  const handleDeleteClick = id => {
    setCurrentCustomerId(id);
    setConfirmDeleteOpen(true);
  };

  const handleCreateOrUpdateCustomer = async () => {
    try {
      let response;
      if (isEditing) {
        response = await api.put(`/customers/${currentCustomerId}`, formData);
        setAlertMessage('Customer updated successfully!');
      } else {
        response = await api.post('/customers', formData);
        setAlertMessage('Customer added successfully!');
      }
      setAlertSeverity('success');
      fetchCustomers();
    } catch (error) {
      setAlertMessage('Failed to add/update customer');
      setAlertSeverity('error');
      console.error('Error adding/updating customer:', error);
    }
    setAlertOpen(true);
    setOpenDialog(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await api.delete(`/customers/${currentCustomerId}`);
      setAlertMessage('Customer deleted successfully!');
      setAlertSeverity('success');
      fetchCustomers();
    } catch (error) {
      setAlertMessage('Failed to delete customer');
      setAlertSeverity('error');
      console.error('Error deleting customer:', error);
    }
    setAlertOpen(true);
    setConfirmDeleteOpen(false);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <Stack spacing={2}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h4' gutterBottom>
            Customers
          </Typography>
          <Button variant='contained' color='primary' onClick={handleOpenDialog}>
            Add Customer
          </Button>
        </Box>
        <Toolbar>
          <Box display='flex' alignItems='center'>
            <OutlinedInput
              value={searchText}
              onChange={handleSearch}
              placeholder='Search...'
              startAdornment={
                <InputAdornment position='start'>
                  <Iconify icon='eva:search-outline' />
                </InputAdornment>
              }
            />
          </Box>
        </Toolbar>
        <Box>
          <IconButton onClick={() => setOpen(!open)}>
            <ArrowDropDownIcon />
          </IconButton>
          {open && (
            <Box ref={menuRef} sx={{ position: 'absolute', zIndex: 1, bgcolor: 'background.paper' }}>
              {getColumns(handleEditClick, handleDeleteClick).map(col => (
                <MenuItem key={col.field}>
                  <Checkbox
                    checked={visibleColumns.includes(col.field)}
                    onChange={() => handleColumnToggle(col.field)}
                  />
                  {col.headerName}
                </MenuItem>
              ))}
              <Box display='flex' justifyContent='space-between' p={1}>
                <Button onClick={handleShowHideAll}>Show/Hide All</Button>
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </Box>
          )}
        </Box>
        <DataGrid
          columns={getColumns(handleEditClick, handleDeleteClick).filter(col => visibleColumns.includes(col.field))}
          rows={filteredRows}
          pageSize={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={params => setPage(params.page)}
          onPageSizeChange={params => setRowsPerPage(params.pageSize)}
          loading={loading}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Stack>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                required
                fullWidth
                label='Full Name'
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Email Address'
                value={formData.email_address}
                onChange={e => setFormData({ ...formData, email_address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Phone Number'
                value={formData.phone_number}
                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Date of Birth'
                type='date'
                InputLabelProps={{ shrink: true }}
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Country'
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label='State'
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              >
                {getStateMenuItems(formData.country).map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='City'
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Address'
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Zip Code'
                value={formData.zip_code}
                onChange={e => setFormData({ ...formData, zip_code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Company'
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            disabled={!isFormValid()}
            onClick={handleCreateOrUpdateCustomer}
            color='primary'
            variant='contained'
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby='confirm-delete-dialog-title'
      >
        <DialogTitle id='confirm-delete-dialog-title'>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this customer?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='primary' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose} TransitionComponent={SlideTransition}>
        <MuiAlert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}
