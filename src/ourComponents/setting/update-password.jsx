import React, { useState } from 'react';
import {
  Card,
  Stack,
  Button,
  Alert as MuiAlert,
  Divider,
  Snackbar,
  CardHeader,
  InputLabel,
  CardActions,
  CardContent,
  FormControl,
  OutlinedInput,
} from '@mui/material';
import { TbPasswordFingerprint as Edit } from "react-icons/tb";
// import { Edit } from '@mui/icons-material';
import axios from 'axios';

const api=import.meta.env.VITE_API;
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

  const handleSubmit = async (event) => {
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
      try {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const userId = userDetails.id;

        const response = await axios.put(`${api}/users/${userId}`, {
          password,
        });

        if (response.status !== 200) {
          throw new Error('Failed to update password');
        }

        handleOpenSnackbar('Password updated successfully', 'success');
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        handleOpenSnackbar('Failed to update password', 'error');
      }
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
                  sx={{ borderColor: !passwordMatch && 'red' }}
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
