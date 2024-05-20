import React, { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

export function UpdatePasswordForm() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleOpenSnackbar = (msg, severity) => {
    setMessage(msg);
    setOpenSnackbar(true);
    if (severity === 'success') {
      setPasswordMatch(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === '' || confirmPassword === '') {
      handleOpenSnackbar('Please fill in both password fields', 'error');
    } else if (password !== confirmPassword) {
      handleOpenSnackbar('Passwords do not match', 'error');
      setPasswordMatch(false);
    } else if (password.length < 6) {
      handleOpenSnackbar('Password must be at least six characters long', 'error');
      setPasswordMatch(false);
    } else {
      // Add logic to update the password here
      handleOpenSnackbar('Password updated successfully', 'success'); // Display success message
    }
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    if (!passwordMatch) {
      setPasswordMatch(true);
    }
  };

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
    if (!passwordMatch) {
      setPasswordMatch(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader subheader="Update password" title="Password" />
          <Divider />
          <CardContent>
            <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
              <FormControl fullWidth>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handleChangePassword}
                  sx={{ borderColor: !passwordMatch && 'red' }} // Yaha dekho
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Confirm password</InputLabel>
                <OutlinedInput
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleChangeConfirmPassword}
                  sx={{ borderColor: !passwordMatch && 'red' }}
                />
              </FormControl>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
          </CardActions>
        </Card>
      </form>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        autoHideDuration={6000} // Adjust the duration as needed
        onClose={handleCloseSnackbar}
        disableWindowBlurListener // Prevent Snackbar from losing focus
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={message.includes('success') ? 'success' : 'error'} // Change severity based on message
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
