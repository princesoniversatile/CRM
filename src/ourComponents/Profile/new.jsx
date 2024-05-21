/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Stack, Avatar,  Container, Typography,  } from '@mui/material';

import NewUserForm from './new-user-form';

function CreateUser() {
  const [photo, setPhoto] = useState(null);
  // const [emailVerified, setEmailVerified] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 3 * 1024 * 1024; // 3 MB

      if (allowedTypes.includes(file.type) && file.size <= maxSize) {
        setPhoto(URL.createObjectURL(file));
      } else {
        // Handle invalid file type or size
        alert(
          'Invalid file type or size. Please select a JPEG, PNG, or GIF file with a maximum size of 3 MB.'
        );
      }
    }
  };

  // const handleEmailVerifiedChange = (e) => {
  //   setEmailVerified(e.target.checked);
  // };


  return (
    <Stack spacing={3}>
      <Container>
        <Typography variant="h4">Create a new user</Typography>
      </Container>
      <Grid container spacing={3}>
        {/* <Grid item lg={4} md={6} xs={12}>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <div>
              <label htmlFor="photo-upload">
                <Avatar
                  src={photo}
                  alt="Upload Photo"
                  sx={{ height: '100px', width: '100px', cursor: 'pointer' }}
                />
              </label>
              <input
                id="photo-upload"
                type="file"
                accept=".jpeg, .jpg, .png, .gif"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
              <Button fullWidth variant="text">
                Upload picture
              </Button>
            </div>
            <Typography variant="body2" color="textSecondary">
              Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3 Mb
            </Typography>
          
           
          </Stack>
        </Grid> */}
        <Grid item lg={8} md={6} xs={12}>
          <NewUserForm />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default CreateUser;
