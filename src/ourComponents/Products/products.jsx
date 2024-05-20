import * as React from 'react';
import Iconify from 'src/components/iconify';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Typography, Box, TextField, Button, InputAdornment, OutlinedInput } from '@mui/material';
import { useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa'; // React Icons se import kiye
import { Container, Stack } from '@mui/system';

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

  return (
    // <Box sx={{ height: 400, width: '100%', backgroundColor: '#f5f5f5', padding: 2 }}>
    <Container sx={{ height: 400, width: '100%', backgroundColor: '#f5f5f5', padding: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" component="h2" gutterBottom>
          Products
        </Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Add Products
        </Button>
      </Stack>

      {/* <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          placeholder="Search Products..."
          variant="outlined"
          sx={{ marginRight: 2 }}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
        <Button
  variant="contained"
  color="primary"
  startIcon={<FaPlus size={14} />}
  sx={{ backgroundColor: '#333', color: '#fff' }} // Dark color for button
>
  Add Products
</Button>
      </Box> */}
      <OutlinedInput
        // label="Search"
        //   sx={{
        // height: 96,
        // display: 'flex',
        // justifyContent: 'space-between',
        // p: (theme) => theme.spacing(0, 1, 0, 3),
        // ...(numSelected > 0 && {
        //   color: 'primary.main',
        //   bgcolor: 'primary.lighter',
        // }),
        //   }}
        sx={{ marginBottom: 1.5 }}
        //   value={filterName}
        onChange={handleSearch}
        placeholder="Search user..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ 
                // color: 'text.disabled', 
                width: 20, height: 20 }}
            />
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
      {/* </Box> */}
    </Container>
  );
}
