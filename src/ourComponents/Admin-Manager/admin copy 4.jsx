import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Switch,
  Slide,
  Typography,
  Toolbar,
} from '@mui/material'
import { MdDelete as Delete, MdEdit as Edit } from 'react-icons/md'
import { MdAdd as AddIcon } from 'react-icons/md'

import MuiAlert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Label from 'src/components/label'

const AdminManager = () => {
  const [employees, setEmployees] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')

  useEffect(() => {
    axios.get('http://localhost:5001/users')
      .then(response => setEmployees(response.data))
      .catch(error => {
        setAlertMessage('Failed to fetch employees')
        setAlertSeverity('error')
        setAlertOpen(true)
      })
  }, [])

  const handleDialogOpen = (employee = {}) => {
    setCurrentEmployee(employee)
    setIsEditing(!!employee.id)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setCurrentEmployee({})
  }

  const handleConfirmDialogOpen = employee => {
    setCurrentEmployee(employee)
    setConfirmDialogOpen(true)
  }

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false)
    setCurrentEmployee({})
  }

  const handleAlertClose = () => {
    setAlertOpen(false)
  }

  const handleSave = () => {
    if (isEditing) {
      axios.put(`http://localhost:5001/users/${currentEmployee.id}`, currentEmployee)
        .then(response => {
          setEmployees(employees.map(emp => (emp.id === currentEmployee.id ? response.data : emp)))
          setAlertMessage('Employee updated successfully!')
          setAlertSeverity('success')
        })
        .catch(error => {
          setAlertMessage('Failed to update employee')
          setAlertSeverity('error')
        })
    } else {
      axios.post('http://localhost:5001/users', currentEmployee)
        .then(response => {
          setEmployees([...employees, response.data])
          setAlertMessage('Employee created successfully!')
          setAlertSeverity('success')
        })
        .catch(error => {
          setAlertMessage('Failed to create employee')
          setAlertSeverity('error')
        })
    }
    setAlertOpen(true)
    handleDialogClose()
  }

  const handleDelete = () => {
    axios.delete(`http://localhost:5001/users/${currentEmployee.id}`)
      .then(() => {
        setEmployees(employees.filter(emp => emp.id !== currentEmployee.id))
        setAlertMessage('Employee deleted successfully!')
        setAlertSeverity('success')
      })
      .catch(error => {
        setAlertMessage('Failed to delete employee')
        setAlertSeverity('error')
      })
    setAlertOpen(true)
    handleConfirmDialogClose()
  }

  return (
    <Box p={3}>
      <Toolbar>
        <Typography variant='h4' style={{ flexGrow: 1 }}>
          Admin Manager
        </Typography>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen()}
        >
          Create New
        </Button>
      </Toolbar>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(employee => (
              <TableRow key={employee.id}>
                <TableCell>{`${employee.first_name} ${employee.last_name}`}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Switch checked={employee.status} disabled />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(employee)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(employee)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isEditing ? 'Edit Employee' : 'Create New Employee'}</DialogTitle>
        <DialogContent> 
          <TextField
            margin='dense'
            label='First Name'
            fullWidth
            value={currentEmployee.first_name || ''}
            onChange={e => setCurrentEmployee({ ...currentEmployee, first_name: e.target.value })}
          />
          <TextField
            margin='dense'
            label='Last Name'
            fullWidth
            value={currentEmployee.last_name || ''}
            onChange={e => setCurrentEmployee({ ...currentEmployee, last_name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            margin='dense'
            label='Email'
            fullWidth
            value={currentEmployee.email || ''}
            onChange={e => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2 }}>
          <Label> Select Role</Label>

            <Select
              fullWidth
              value={currentEmployee.role || ''}
              onChange={e => setCurrentEmployee({ ...currentEmployee, role: e.target.value })}
              displayEmpty
            >
              <MenuItem value='' disabled>
                Select Role
              </MenuItem>
              <MenuItem value='Admin'>Admin</MenuItem>
              <MenuItem value='User'>User</MenuItem>
            </Select>
          </Box>
          <Box sx={{ mt: 2 }}>
          <Label>Select Status</Label>
            <Select
              fullWidth
              value={currentEmployee.status ? 'Active' : 'Inactive'}
              onChange={e =>
                setCurrentEmployee({ ...currentEmployee, status: e.target.value === 'Active' })
              }
              displayEmpty
            >
              <MenuItem value='' disabled>
                Select Status
              </MenuItem>
              <MenuItem value='Active'>Active</MenuItem>
              <MenuItem value='Inactive'>Inactive</MenuItem>
            </Select>
          </Box>
          {!isEditing && (
            <>
              <TextField
                margin='dense'
                label='Password'
                type='password'
                fullWidth
                value={currentEmployee.password || ''}
                onChange={e => setCurrentEmployee({ ...currentEmployee, password: e.target.value })}
                sx={{ mt: 2 }}
              />
              <TextField
                margin='dense'
                label='Confirm Password'
                type='password'
                fullWidth
                value={currentEmployee.confirmPassword || ''}
                onChange={e =>
                  setCurrentEmployee({ ...currentEmployee, confirmPassword: e.target.value })
                }
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSave} color='primary'>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this employee?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='primary'>
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
    </Box>
  )
}

export default AdminManager
