import React, { useState } from 'react';
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
  Grid,
  Switch
} from '@mui/material';
import { MdMoreVert as MoreVertIcon } from 'react-icons/md';
import { MdAdd as AddIcon } from 'react-icons/md';

const initialEmployees = [
  { name: 'Terry Lipshutz', email: 'te@orixcreative.com', role: 'UI UX Designer', status: 'Active', manager: 'Jakob', team: 'Design Team', office: 'Orix Dubai' },
  { name: 'Jaylon Aminoff', email: 'ja@orixcreative.com', role: 'Graphic Designer', status: 'Probation', manager: 'Wilson', team: 'Project Team', office: 'Orix USA' },
  { name: 'Terry Herwitz', email: 'te@orixcreative.com', role: 'UX Designer', status: 'Active', manager: 'Wilson', team: 'Design Team', office: 'Orix Dubai' },
  { name: 'Leo Septimus', email: 'le@orixcreative.com', role: 'Content Writer', status: 'Onboarding', manager: 'Craig', team: 'Marketing Team', office: 'Orix Dubai' },
  { name: 'Corey Vetrovs', email: 'co@orixcreative.com', role: 'Content Writer', status: 'On leave', manager: 'Jakob', team: 'Marketing Team', office: 'Orix USA' },
  { name: 'Martin Stanton', email: 'ma@orixcreative.com', role: 'Web Developer', status: 'Active', manager: 'Jakob', team: 'Dev Team', office: 'Orix Dubai' },
];

const AdminEmployeeTable = () => {
  const [employees, setEmployees] = useState(initialEmployees);

  const handleStatusChange = (index) => {
    const updatedEmployees = employees.map((employee, i) => 
      i === index ? { ...employee, status: employee.status === 'Active' ? 'Inactive' : 'Active' } : employee
    );
    setEmployees(updatedEmployees);
  };

  return (
    <div>
      <AppBar position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Admin Manager
          </Typography>
          <Button color="inherit" startIcon={<AddIcon />}>
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
            {employees.map((employee, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={employee.name} src={`https://i.pravatar.cc/150?img=${index + 1}`} />
                    <Typography variant="body1" style={{ marginLeft: 10 }}>
                      {employee.name}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={employee.status === 'Active'}
                    onChange={() => handleStatusChange(index)}
                    color="primary"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AdminEmployeeTable;
