import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  Typography,
  IconButton,
  Button,
  Toolbar,
  AppBar,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Slide,
} from '@mui/material';
import { MdMoreVert as MoreVertIcon } from 'react-icons/md';
import { MdAdd as AddIcon } from 'react-icons/md';
import { MdDelete as DeleteIcon, MdEdit as EditIcon } from 'react-icons/md';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import axios from 'axios';

const api = import.meta.env.VITE_API;

const AdminEmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${api}/users`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(`${api}/users/${id}`, { status: newStatus });
      if (response.status !== 200) {
        throw new Error('Failed to update status');
      }
      const updatedEmployees = employees.map((employee) =>
        employee.id === id ? { ...employee, status: newStatus } : employee
      );
      setEmployees(updatedEmployees);
      showAlert('success', 'Employee status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error.message);
      showAlert('error', 'Failed to update employee status');
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await axios.delete(`${api}/users/${id}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete employee');
      }
      const updatedEmployees = employees.filter(
        (employee) => employee.id !== id
      );
      setEmployees(updatedEmployees);
      showAlert('success', 'Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error.message);
      showAlert('error', 'Failed to delete employee');
    }
  };

  const createEmployee = async () => {
    try {
      const response = await axios.post(`${api}/users`, {
        first_name: firstName,
        last_name: lastName,
        role: role,
        status: status,
        email: email,
        password: password,
      });
      if (response.status === 200) {
        fetchEmployees();
        handleClose();
        showAlert('success', 'Employee created successfully');
      } else {
        throw new Error('Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error.message);
      showAlert('error', 'Failed to create employee');
    }
  };

  const updateEmployee = async () => {
    const id = selectedEmployeeId;
    try {
      const response = await axios.put(`${api}/users/${id}`, {
        first_name: firstName,
        last_name: lastName,
        role: role,
        status: status,
        email: email,
        password: password,
      });
      if (response.status === 200) {
        fetchEmployees();
        handleClose();
        showAlert('success', 'Employee updated successfully');
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error.message);
      showAlert('error', 'Failed to update employee');
    }
  };

  const getAvatarIcon = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  const openCreateForm = () => {
    setOpenForm(true);
  };

  const openEditForm = (employee) => {
    setSelectedEmployeeId(employee.id);
    setOpenForm(true);
    setFirstName(employee.first_name);
    setLastName(employee.last_name);
    setRole(employee.role);
    setStatus(employee.status);
    setEmail(employee.email);
    setPassword('');
  };

  const handleClose = () => {
    setOpenForm(false);
    setFirstName('');
    setLastName('');
    setRole('');
    setStatus(true);
    setEmail('');
    setPassword('');
    setSelectedEmployeeId(null);
  };

  const handleDeleteConfirm = (id) => {
    setSelectedEmployeeId(id);
  };

  const handleDeleteCancel = () => {
    setSelectedEmployeeId(null);
  };

  const handleDeleteConfirmAction = () => {
    deleteEmployee(selectedEmployeeId);
    setSelectedEmployeeId(null);
  };

  const showAlert = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <div>
      <AppBar position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Admin Manager
          </Typography>
          <Button color="inherit" startIcon={<AddIcon />} onClick={openCreateForm}>
            Create New
          </Button>
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {employee.avatar ? (
                      <Avatar
                        alt={employee.name}
                        src={`${api}${employee.avatar}`}
                      />
                    ) : (
                      <Avatar>{getAvatarIcon(employee.name)}</Avatar>
                    )}
                    <Typography
                      variant="body1"
                      style={{ marginLeft: 10 }}
                    >
                      {employee.first_name + ' ' + employee.last_name}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={employee.status === true}
                    onChange={() =>
                      handleStatusChange(
                        employee.id,
                        !employee.status
                      )
                    }
                    color="primary"
                  />
                </TableCell>
                
                <TableCell align="right">
                  <IconButton
                    onClick={() => openEditForm(employee)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteConfirm(employee.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openForm} onClose={handleClose}>
        <DialogTitle>{selectedEmployeeId ? 'Edit Employee' : 'Create New Employee'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Role"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
          {!selectedEmployeeId && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={selectedEmployeeId ? updateEmployee : createEmployee} color="primary">
            {selectedEmployeeId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!selectedEmployeeId}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this employee?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmAction} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        TransitionComponent={Slide}
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
    </div>
  );
};

export default AdminEmployeeTable;
