import React from 'react';
import { Container, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const ResolutionsForm = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Post-Sales Resolutions
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Complaint ID" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Resolution Description" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Resolved By" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Resolution Date" type="date" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Resolution Status</InputLabel>
              <Select>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth>
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default ResolutionsForm;
