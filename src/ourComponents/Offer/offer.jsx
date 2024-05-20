import React from 'react';
import { Container, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const OfferForm = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Pre-Sales Offers
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Offer ID" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Offer Description" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Offer Start Date" type="date" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Offer End Date" type="date" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Offer Type</InputLabel>
              <Select>
                <MenuItem value="discount">Discount</MenuItem>
                <MenuItem value="deal">Deal</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Offer Amount" type="number" />
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

export default OfferForm;
