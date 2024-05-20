import React from 'react';
import { Container, Typography, Grid, TextField, Button } from '@mui/material';

const BirthdayReminders = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Birthday Reminders
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Contact Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Contact Email" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Date of Birth" type="date" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Reminder Date" type="date" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={4} label="Notes" />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth>
            Save Reminder
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default BirthdayReminders;
