import React from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AccountInfo from './account-info';
import AccountDetailsForm from './account-details-form';

function ProfilePage() {
  return (
    <Stack spacing={3}>
    <Container >
    <div>
        <Typography variant="h4">Account</Typography>
      </div>
    </Container>
      
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default ProfilePage;
