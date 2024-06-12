/* eslint-disable no-nested-ternary */
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
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { MdDelete as Delete, MdEdit as Edit } from 'react-icons/md'
import { MdAdd as AddIcon } from 'react-icons/md'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import MuiAlert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Label from 'src/components/label'
import { BarLoader } from 'react-spinners'

import SvgColor from 'src/components/svg-color'

const icon = name => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const navConfig = [
  {
    title: 'Pre Sales',
    icon: icon('ic_pre_sales'),
    subMenus: [
      {
        title: 'Customers',
        path: '/customer',
        icon: icon('ic_user'),
      },
      {
        title: 'Products-Category',
        path: '/product-category',
        icon: icon('ic_pro_cat'),
      },
      {
        title: 'Products',
        path: '/products',
        icon: icon('ic_cart'),
      },
      {
        title: 'Leads',
        path: '/leads',
        icon: icon('ic_lead'),
      },
      {
        title: 'Offers',
        path: '/offers',
        icon: icon('ic_offer'),
      },
      {
        title: 'Birthday Reminders',
        path: '/birthday-reminders',
        icon: icon('ic_cakes'),
      },
      {
        title: 'Reports',
        path: '/reports',
        icon: icon('ic_report'),
      },
    ],
  },
  {
    title: 'Post Sales',
    path: '',
    icon: icon('ic_post_sales'),
    subMenus: [
      {
        title: 'Complaints',
        path: '/complaints',
        icon: icon('ic_complaint'),
      },
      {
        title: 'Resolutions',
        path: '/resolution',
        icon: icon('ic_resolution'),
      },
    ],
  },
  {
    title: 'Lead Capture',
    path: '',
    icon: icon('ic_lead_capture'),
    subMenus: [
      {
        title: 'Scrapper Tool',
        path: '/scrapper',
        icon: icon('ic_scrapper'),
      },
    ],
  },
  {
    title: 'Admin Management',
    path: '',
    icon: icon('ic_admin'),
    subMenus: [
      {
        title: 'Admin Manager',
        path: '/admin',
        icon: icon('ic_admin'),
      },
    ],
  },
]

const AdminManager = () => {
  const [employees, setEmployees] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(true)

  const api = import.meta.env.VITE_API

  useEffect(() => {
    axios
      .get(`${api}/users`)
      .then(response => {
        setEmployees(response.data)
        setLoading(false)
      })
      .catch(error => {
        setAlertMessage('Failed to fetch employees')
        setAlertSeverity('error')
        setAlertOpen(true)
        setLoading(false)
      })
  }, [])

  function handleDialogOpen (employee = {}) {
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
    const employeeData = { ...currentEmployee }
    delete employeeData.confirmPassword // Remove confirmPassword before sending to backend

    if (isEditing) {
      axios
        .put(`${api}/users/${currentEmployee.id}`, employeeData)
        .then(response => {
          setEmployees(employees.map(emp => (emp.id === currentEmployee.id ? response.data : emp)))
          setAlertMessage('Employee updated successfully!')
          setAlertSeverity('success')
        })
        .catch(error => {
          console.log(error)
          setAlertMessage('Failed to update employee')
          setAlertSeverity('error')
        })
    } else {
      axios
        .post(`${api}/users`, employeeData)
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
    axios
      .delete(`${api}/users/${currentEmployee.id}`)
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

  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const handleSaveClick = () => {
    if (!validateEmail(currentEmployee.email)) {
      setAlertMessage('Invalid email address')
      setAlertSeverity('error')
      setAlertOpen(true)
      return
    }
    if (!isEditing && currentEmployee.password !== currentEmployee.confirmPassword) {
      setAlertMessage('Passwords do not match')
      setAlertSeverity('error')
      setAlertOpen(true)
      return
    }
    handleSave()
  }

  const handleAccessMenuChange = (menuTitle, checked) => {
    let updatedAccessMenus = []

    if (currentEmployee.accessmenus) {
      try {
        updatedAccessMenus = JSON.parse(currentEmployee.accessmenus)
      } catch (error) {
        console.log('Error parsing JSON:', error)
      }
    }

    updatedAccessMenus = checked
      ? [...updatedAccessMenus, menuTitle]
      : updatedAccessMenus.filter(title => title !== menuTitle)

    setCurrentEmployee(prevEmployee => ({
      ...prevEmployee,
      accessmenus: JSON.stringify(updatedAccessMenus),
    }))
  }

  return (
    <Box p={3}>
      <Toolbar>
        <Typography variant='h4' style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <SvgColor
            src={`/assets/icons/navbar/ic_admin.svg`}
            sx={{ width: 50, height: 30, marginRight: 2 }}
          />
          Admin Manager
        </Typography>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<AddIcon />}
          onClick={handleDialogOpen}
          style={{ marginLeft: 'auto' }}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                    <BarLoader color='#36d7b7' />
                  </Box>
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', pt: 4 }}>
                  <Typography variant='body1'>No Admins found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map(employee => (
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
              ))
            )}
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
            error={!validateEmail(currentEmployee.email)}
            helperText={!validateEmail(currentEmployee.email) ? 'Invalid email address' : ''}
          />
          <Box sx={{ mt: 2 }}>
            <Label>Select Role</Label>
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
              <MenuItem value='Management'>Management</MenuItem>
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
              <Box sx={{ mt: 2, position: 'relative' }}>
                <TextField
                  margin='dense'
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={currentEmployee.password || ''}
                  onChange={e =>
                    setCurrentEmployee({ ...currentEmployee, password: e.target.value })
                  }
                  sx={{ mt: 2 }}
                />
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ position: 'absolute', right: '10px', top: '30px' }}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </IconButton>
              </Box>
              <Box sx={{ mt: 2, position: 'relative' }}>
                <TextField
                  margin='dense'
                  label='Confirm Password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  value={currentEmployee.confirmPassword || ''}
                  onChange={e =>
                    setCurrentEmployee({ ...currentEmployee, confirmPassword: e.target.value })
                  }
                  sx={{ mt: 2 }}
                />
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  sx={{ position: 'absolute', right: '10px', top: '30px' }}
                >
                  {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </IconButton>
              </Box>
              {currentEmployee.password !== currentEmployee.confirmPassword && (
                <Typography color='error' variant='body2'>
                  Passwords do not match
                </Typography>
              )}
            </>
          )}

          {/* Permission Checkboxes */}
          {/* <Box sx={{ mt: 2 }}>
            <Typography variant='h6'>Permission Checkboxes</Typography>
            {navConfig.map(menu => (
              <Box key={menu.title} sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>{menu.title}</Typography>
                {menu.subMenus.map(subMenu => (
                  <FormControlLabel
                    key={subMenu.title}
                    control={
                      <Checkbox
                        checked={
                          currentEmployee.accessmenus
                            ? currentEmployee.accessmenus.includes(subMenu.title)
                            : false
                        }
                        onChange={e =>
                          handleAccessMenuChange(subMenu.title, e.target.checked)
                        }
                        name={subMenu.title}
                      />
                    }
                    label={subMenu.title}
                  />
                ))}
              </Box>
            ))}
          </Box> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSaveClick} color='primary'>
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
