import React, { useState } from 'react';


import { Grid, Button,  TextField, Typography } from '@mui/material';

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipCode: '',
    company: '',
    role: '',
    
  });

  const [errors, setErrors] = useState({
    fullName: false,
    emailAddress: false,
    phoneNumber: false,
    country: false,
    state: false,
    city: false,
    address: false,
    zipCode: false,
    company: false,
    role: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false }); // Clear error when user starts typing
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};

    // Check for errors in form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '') {
        formErrors[key] = true;
      }
    });

    // Update errors state
    setErrors(formErrors);

    // If no errors, submit form
    if (Object.keys(formErrors).length === 0) {
      // Handle form submission logic here
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <Grid container spacing={2}>
        {Object.entries(formData).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <TextField
              fullWidth
              label={key.replace(/([A-Z])/g, ' $1').trim()} // Convert camelCase key to human readable label
              name={key}
              value={value}
              onChange={handleChange}
              error={errors[key]}
              helperText={errors[key] ? 'is required' : ''}
            />
          </Grid>
        ))}
        
        {/* <Grid item xs={12}>
          <Typography variant="body2" color="textSecondary">
            Disabling this will automatically send the user a verification email
          </Typography>
        </Grid> */}
      </Grid>
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
        Create User
      </Button>
    </form>
  );
};

export default NewUserForm;
