import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { account } from 'src/_mock/account';
import axios from 'axios';
import { SnackbarProvider, useSnackbar } from 'notistack';

const { states } = account;

function ProfilePage() {
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    avatar: '',
    state: '',
    city: '',
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('userDetails')).id;
    axios.get(`http://localhost:5001/users/${userId}`)
      .then(response => {
        const userData = response.data;
        setUser({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone_number: userData.phone_number || '',
          // avatar: userData.avatar || '',
          state: userData.state || '',
          city: userData.city || '',
        });
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userId = JSON.parse(localStorage.getItem('userDetails')).id;
    axios.put(`http://localhost:5001/users/${userId}`, user)
      .then(() => {
        setAlertSeverity('success');
        setAlertMessage('Profile updated successfully!');
        setAlertOpen(true);
        enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
      })
      .catch(error => {
        setAlertSeverity('error');
        setAlertMessage('Error updating profile!');
        setAlertOpen(true);
        enqueueSnackbar('Error updating profile!', { variant: 'error' });
        console.error('Error updating user data:', error);
      });
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <Stack spacing={2}>
      <Container>
        <div>
          <Typography variant='h4'>Account</Typography>
        </div>
      </Container>

      <Grid container spacing={2}>
        <Grid item lg={4} md={6} xs={11}>
          {/* Account Info */}
          <Card>
            <CardContent>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <div>
                  {user.avatar ? (
                    <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
                  ) : (
                    <Avatar sx={{ height: '80px', width: '80px', bgcolor: '#58C29F' }}>
                      {user.first_name.charAt(0) + user.last_name.charAt(0)}
                    </Avatar>
                  )}
                </div>
                <Stack spacing={1} sx={{ textAlign: 'center' }}>
                  <Typography variant='h5'>{`${user.first_name} ${user.last_name}`}</Typography>
                  <Typography color='text.secondary' variant='body2'>
                    {user.city} {user.state.charAt(0).toUpperCase() + user.state.slice(1)}
                  </Typography>
                  <Typography color='text.secondary' variant='body2'>
                    UTC+5:30
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={7.5} md={4} xs={11}>
          {/* Account Details Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader subheader="The information can be edited" title="Profile" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>First name</InputLabel>
                      <OutlinedInput
                        value={user.first_name}
                        label="First name"
                        name="first_name"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Last name</InputLabel>
                      <OutlinedInput
                        value={user.last_name}
                        label="Last name"
                        name="last_name"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Email address</InputLabel>
                      <OutlinedInput
                        value={user.email}
                        label="Email address"
                        name="email"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Phone number</InputLabel>
                      <OutlinedInput
                        label="Phone number"
                        value={user.phone_number}
                        name="phone_number"
                        type="tel"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select
                        value={user.state}
                        label="State"
                        name="state"
                        variant="outlined"
                        onChange={handleChange}
                      >
                        {states.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>City</InputLabel>
                      <OutlinedInput
                        label="City"
                        value={user.city}
                        name="city"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained">Save details</Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={handleAlertClose}
          severity={alertSeverity}
        >
          {alertSeverity === 'success' ? (
            <Typography variant="subtitle1" component="div">
              Profile updated successfully!
            </Typography>
          ) : (
            <Typography variant="subtitle1" component="div">
              Error updating profile!
            </Typography>
          )}
        </MuiAlert>
      </Snackbar>
    </Stack>
  );
}

export default ProfilePage;
