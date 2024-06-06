import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
// import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AlertTitle from '@mui/material/AlertTitle'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, MuiAlert } from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'

import { useRouter } from 'src/routes/hooks'

import Logo from 'src/components/logo'
import Iconify from 'src/components/iconify'

const api = import.meta.env.VITE_API
export default function LoginView () {
  // const theme = useTheme();
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [errorAlert, setErrorAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const handleClick = useCallback(async () => {
    const email = document.getElementsByName('email')[0].value
    const password = document.getElementsByName('password')[0].value

    setLoading(true)
    try {
      const response = await axios.post(`${api}/login`, { email, password })
      setLoading(false)
      setLoginSuccess(true)
      localStorage.setItem('loggedIn', 'true')
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userDetails', JSON.stringify(response.data.userDetails)) // Yahaan userDetails ko localStorage mein daal diya
      setSnackbarSeverity('success')
      setSnackbarMessage('Login successful')
      setSnackbarOpen(true)
      console.log(response.data)
      router.push('/')
    } catch (error) {
      console.log(error)
      setLoading(false)
      setErrorAlert(true)
      setSnackbarSeverity('error')
      setSnackbarMessage('Incorrect email or password. Please correct and try again.')
      setSnackbarOpen(true)
    }
  }, [router])

  useEffect(() => {
    const handleKeyPress = event => {
      if (event.key === 'Enter') {
        handleClick()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleClick])

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbarOpen(false)
  }

  const renderForm = (
    <>
      {errorAlert && (
        <Alert severity='error'>
          <AlertTitle>Authentication Error</AlertTitle>
          Incorrect email or password. Please correct and try again.
        </Alert>
      )}
      {loginSuccess ? (
        <Alert severity='success'>
          <AlertTitle>Login Success</AlertTitle>
          You have successfully logged in.
        </Alert>
      ) : (
        <Stack spacing={3} sx={{ my: 3 }}>
          <TextField name='email' label='Email address' required />
          <TextField
            name='password'
            label='Password'
            required
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      )}
      <Stack direction='row' alignItems='center' justifyContent='flex-end' sx={{ my: 3 }} />
      <LoadingButton
        fullWidth
        size='large'
        type='submit'
        variant='contained'
        color='inherit'
        loading={loading}
        onClick={handleClick}
      >
        Login
      </LoadingButton>
    </>
  )

  return (
    <Box
      sx={{
        backgroundImage: `url('/assets/background/overlay_4.jpg')`,
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Card sx={{ p: 5, maxWidth: 420, width: '100%' }}>
        <Typography variant='h4' sx={{ mb: 3 }}>
          Sign in
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {renderForm}
      </Card>
      <Logo
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
        }}
      />
    </Box>
  )
}
