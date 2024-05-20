import React, { useState } from 'react';
import { TextField, Button, Grid, Container } from '@mui/material';

const CategoryCreationForm = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Category Name:', categoryName);
    console.log('Description:', description);
    // Reset form fields after submission
    setCategoryName('');
    setDescription('');
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Create Category
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default CategoryCreationForm;
