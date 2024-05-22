import * as React from 'react';
import Iconify from 'src/components/iconify';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Typography, Box, TextField, Button, InputAdornment, OutlinedInput, Snackbar } from '@mui/material';
import { useState } from 'react';
import { Container, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';
import Slide from '@mui/material/Slide';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const columns = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'category', headerName: 'Category', width: 200 },
  { field: 'price', headerName: 'Price (₹)', type: 'number', width: 150 },
  { field: 'inStock', headerName: 'In Stock', width: 150 },
  { field: 'status', headerName: 'Status', width: 200 },
];

const initialRows = [
  {
    id: 1,
    name: 'iPhone 13',
    category: 'Electronics',
    price: 80000,
    inStock: 'Yes',
    status: 'New',
  },
  { id: 2, name: 'T-shirt', category: 'Clothing', price: 1000, inStock: 'No', status: 'Sale' },
  { id: 3, name: 'Harry Potter', category: 'Books', price: 500, inStock: 'Yes', status: 'New' },
  { id: 4, name: 'Lipstick', category: 'Beauty', price: 1200, inStock: 'Yes', status: 'Sale' },
  { id: 5, name: 'Laptop', category: 'Electronics', price: 60000, inStock: 'No', status: 'New' },
  {
    id: 6,
    name: 'Headphones',
    category: 'Electronics',
    price: 1500,
    inStock: 'Yes',
    status: 'New',
  },
  { id: 7, name: 'Jeans', category: 'Clothing', price: 2000, inStock: 'No', status: 'Sale' },
  { id: 8, name: 'Cookbook', category: 'Books', price: 800, inStock: 'Yes', status: 'New' },
  { id: 9, name: 'Foundation', category: 'Beauty', price: 1800, inStock: 'Yes', status: 'Sale' },
  {
    id: 10,
    name: 'Smartwatch',
    category: 'Electronics',
    price: 12000,
    inStock: 'No',
    status: 'New',
  },
];

export default function DataTableProduct() {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState(initialRows);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
  };

  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(searchText) ||
      row.category.toLowerCase().includes(searchText) ||
      row.price.toString().includes(searchText) ||
      row.inStock.toLowerCase().includes(searchText) ||
      row.status.toLowerCase().includes(searchText)
  );

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    // Handle submit logic here
    setAlertOpen(true);
    handleCloseDialog();
    // You can add more logic to update the data if needed
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <Container sx={{ height: 400, width: '100%', backgroundColor: '#f5f5f5', padding: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" component="h2" gutterBottom>
          Products
        </Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenDialog}>
          Add Products
        </Button>
      </Stack>

      <OutlinedInput
        sx={{ marginBottom: 1.5 }}
        onChange={handleSearch}
        placeholder="Search products..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        components={{
          Toolbar: GridToolbar,
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
      />

      {/* dialog box for post to handle request */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          {/* Your form fields can be added here */}
          <TextField label="Product Name" variant="outlined" fullWidth sx={{ marginBottom: 2 }} />
          <TextField label="Category" variant="outlined" fullWidth sx={{ marginBottom: 2 }} />
          <TextField label="Price" variant="outlined" fullWidth sx={{ marginBottom: 2 }} />
          <TextField label="In Stock" variant="outlined" fullWidth sx={{ marginBottom: 2 }} />
          <TextField label="Status" variant="outlined" fullWidth sx={{ marginBottom: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
{/* mui alert to handle notification */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose} TransitionComponent={Slide}>
        <MuiAlert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          <AlertTitle>Success</AlertTitle>
          Product added successfully!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}
