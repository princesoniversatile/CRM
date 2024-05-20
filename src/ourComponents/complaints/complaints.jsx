import React from 'react';
import { Container, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const PostSalesComplaintsForm = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Post-Sales Complaints
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Phone Number" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Address" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Complaint Type</InputLabel>
              <Select>
                <MenuItem value="product">Product Issue</MenuItem>
                <MenuItem value="service">Service Issue</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Date of Complaint" type="date" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={5} label="Description" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Product/Service Name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Order ID" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Invoice Number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Severity Level</InputLabel>
              <Select>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default PostSalesComplaintsForm;
