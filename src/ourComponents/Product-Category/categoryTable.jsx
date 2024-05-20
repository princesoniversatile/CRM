import React, { useState } from 'react';
import { MdAdd as AddIcon } from 'react-icons/md'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
// import AddIcon from '@mui/icons-material/Add';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Category Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
];


const initialCategories = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets' },
  { id: 2, name: 'Clothing', description: 'Apparel and fashion accessories' },
  { id: 3, name: 'Home & Furniture', description: 'Furniture and home decor' },
  { id: 4, name: 'Books', description: 'Books and educational material' },
  { id: 5, name: 'Beauty', description: 'Beauty and personal care products' },
];

function EditToolbar (props) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = Math.max(...initialRows.map(row => row.id)) + 1 // Generate unique id
    setRows(oldRows => [...oldRows, { id, title: '', description: '', isNew: true }])
    setRowModesModel(oldModel => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  )
}

const ProductCategoryTable = ({ onCreateCategory }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase()) ||
    category.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCreateCategory = () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      alert('Please enter both category name and description.');
      return;
    }
    const newCategoryId = categories.length + 1;
    const newCategoryData = { ...newCategory, id: newCategoryId };
    setCategories([...categories, newCategoryData]);
    onCreateCategory(newCategoryData);
    setOpenDialog(false);
    setNewCategory({ name: '', description: '' });
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h4">Product Category</Typography>
        {/* <Button
          variant="contained"
        //   startIcon={<AddIcon />}
          component={Link}
          to="/product-category"
        >
          Add New Category
        </Button> */}
      </div>
      <div style={{ marginBottom: '16px' }}>
        <TextField
          label="Search"
          value={searchText}
          onChange={handleSearch}
          placeholder='search...'
        />
      </div>
      <div style={{ height: 400, width: '100%' }}>
        {filteredCategories.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>No rows</div>
        ) : (
          <DataGrid rows={filteredCategories} columns={columns} pageSize={5}  slots={{
              toolbar: EditToolbar
              
            }} />
        )}
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateCategory} color="primary" variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProductCategoryTable;
