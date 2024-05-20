import { useState } from 'react'

import Box from '@mui/material/Box'
// import Link from '@mui/material/Link';
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
// import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AlertTitle from '@mui/material/AlertTitle'
import LoadingButton from '@mui/lab/LoadingButton'
import { alpha, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

import { useRouter } from 'src/routes/hooks'

import { bgGradient } from 'src/theme/css'

import Logo from 'src/components/logo'
import Iconify from 'src/components/iconify'

// ----------------------------------------------------------------------

export default function LoginView () {
  const theme = useTheme()

  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false)

  const handleClick = () => {
    const email = document.getElementsByName('email')[0].value;
    const password = document.getElementsByName('password')[0].value;
  
    if (email === 'kuldeepmathur@gmail.com' && password === '123456') {
      setLoginSuccess(true);
      localStorage.setItem('loggedIn', 'true'); // Yahan pe localStorage mein loggedIn key ke saath true save kiya hai


      router.push('/');

    } else {
      setErrorAlert(true);
    }
  };
  

  const renderForm = (
    <>
     {errorAlert && (
      <Alert severity='error'>
        <AlertTitle>Authentication Error</AlertTitle>
        Incorrect email or password. Please correct and try again.
      </Alert>
    )}

    {loginSuccess ? (
      <Alert severity='success' >
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
      <Stack direction='row' alignItems='center' justifyContent='flex-end' sx={{ my: 3 }}>
        {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        size='large'
        type='submit'
        variant='contained'
        color='inherit'
        onClick={handleClick}
      >
        Login
      </LoadingButton>
    </>
  )

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems='center' justifyContent='center' sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant='h4'>Sign in</Typography>

         

          <Divider sx={{ my: 3 }}>
            {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography> */}
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  )
}
