/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { IoIosPersonAdd } from 'react-icons/io';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Stack, Avatar, Container, Typography } from '@mui/material';

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
        alert(
          'Invalid file type or size. Please select a JPEG, PNG, or GIF file with a maximum size of 3 MB.'
        );
      }
    }
  };

  return (
    <Stack spacing={3}>
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '17px' }}>
          <IoIosPersonAdd size={28} style={{ marginRight: '8px', marginBottom: '7px' }} />
          <Typography variant="h4" gutterBottom>
            Create a new user
          </Typography>
        </div>{' '}
      </Container>
      <Container>
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
      </Container>
    </Stack>
  );
}

export default CreateUser;
