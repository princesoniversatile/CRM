import React, { useState, useEffect } from 'react'
import Iconify from 'src/components/iconify'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import {
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  CircularProgress,
  MenuItem,
  AlertTitle,
  IconButton,
  Toolbar,
  TablePagination,
} from '@mui/material'
import {
  Container,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import { IconContext } from 'react-icons'

import { AiOutlineShopping } from 'react-icons/ai' // Add the shopping icon

import api from 'src/utils/api' // Import the axios instance
import { MdAdd as AddIcon, MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md'
import SvgColor from 'src/components/svg-color'

function SlideTransition (props) {
  return <Slide {...props} direction='up' />
}

const columns = (handleEditClick, handleDeleteClick) => [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'category', headerName: 'Category', width: 200 },
  { field: 'price', headerName: 'Price (₹)', type: 'number', width: 150 },
  { field: 'in_stock', headerName: 'In Stock', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 110,
    renderCell: params => (
      <>
        <IconButton onClick={() => handleEditClick(params.id)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteClick(params.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
]

export default function DataTableProduct () {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [searchText, setSearchText] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    in_stock: '',
    status: '',
  })

  const isProductFormValid = () => {
    return (
      formData.name &&
      formData.category &&
      formData.price &&
      !isNaN(formData.price) &&
      formData.price > 0 &&
      formData.in_stock &&
      formData.status
    )
  }

  const [categories, setCategories] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentProductId, setCurrentProductId] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setRows(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleSearch = event => {
    const value = event.target.value.toLowerCase()
    setSearchText(value)
  }

  const filteredRows = rows.filter(
    row =>
      row.name.toLowerCase().includes(searchText) ||
      row.category.toLowerCase().includes(searchText) ||
      row.price.toString().includes(searchText) ||
      row.in_stock.toLowerCase().includes(searchText) ||
      row.status.toLowerCase().includes(searchText)
  )

  const handleOpenDialog = () => {
    setIsEditing(false)
    setFormData({
      name: '',
      category: '',
      price: '',
      in_stock: '',
      status: '',
    })
    setOpenDialog(true)
  }

  const handleEditClick = id => {
    const product = rows.find(row => row.id === id)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      in_stock: product.in_stock,
      status: product.status,
    })
    setIsEditing(true)
    setCurrentProductId(id)
    setOpenDialog(true)
  }

  const handleDeleteClick = id => {
    setCurrentProductId(id)
    setConfirmDeleteOpen(true)
  }

  const handleCreateOrUpdateCategory = async () => {
    try {
      console.log('Sending data:', formData)
      let response
      if (isEditing) {
        response = await api.put(`/products/${currentProductId}`, formData)
        console.log('Update response:', response)
        setAlertMessage('Product updated successfully!')
      } else {
        response = await api.post('/products', formData)
        console.log('Create response:', response)
        setAlertMessage('Product added successfully!')
      }
      setAlertSeverity('success')
      fetchProducts()
    } catch (error) {
      setAlertMessage('Failed to add/update product')
      setAlertSeverity('error')
      console.error('Error adding/updating product:', error)
    }
    setAlertOpen(true)
    setOpenDialog(false)
  }

  const handleDeleteConfirm = async () => {
    try {
      console.log('Deleting product with id:', currentProductId)
      const response = await api.delete(`/products/${currentProductId}`)
      console.log('Delete response:', response)
      setAlertMessage('Product deleted successfully!')
      setAlertSeverity('success')
      fetchProducts()
    } catch (error) {
      setAlertMessage('Failed to delete product')
      setAlertSeverity('error')
      console.error('Error deleting product:', error)
    }
    setAlertOpen(true)
    setConfirmDeleteOpen(false)
  }

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlertOpen(false)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  return (
    <Container sx={{ height: 400, width: '100%', backgroundColor: '#f5f5f5', padding: 2 }}>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
        <Typography
          variant='h4'
          component='h2'
          // gutterBottom
          style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        >
          <SvgColor
            src={`/assets/icons/navbar/ic_cart.svg`}
            sx={{ width: 40, height: 40, marginRight: 2 }}
          />
          Products
        </Typography>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          style={{ marginLeft: 'auto' }}
        >
          Add Products
        </Button>
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <OutlinedInput
          sx={{ marginBottom: 1.5 }}
          onChange={handleSearch}
          placeholder='Search products...'
          startAdornment={
            <InputAdornment position='start'>
              <Iconify
                icon='eva:search-fill'
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
        <TablePagination
          position='right'
          page={page}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25, 50, 70]}
          onRowsPerPageChange={event => {
            setRowsPerPage(parseInt(event.target.value, 10))
            setPage(0)
          }}
        />
      </div>
      <div style={{ height: 330, width: '100%' }}>
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </div>
        ) : filteredRows.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <AiOutlineShopping style={{ fontSize: '48px' }} />
              <Typography variant='body1' style={{ marginTop: '10px' }}>
                No products found.
              </Typography>
            </div>
          </div>
        ) : (
          <DataGrid
            // rows={filteredRows}
            // columns={columns(handleEditClick, handleDeleteClick)}
            // pageSize={5}
            // components={{ Toolbar: GridToolbar }}
            rows={filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
            columns={columns(handleEditClick, handleDeleteClick)}
            pageSize={rowsPerPage}
            onPageChange={params => setPage(params.page)}
            onPageSizeChange={params => setRowsPerPage(params.pageSize)}
            pagination
            components={{ Toolbar: GridToolbar }}
            autoHeight
            loading={loading}
          />
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Product Name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.name}
                helperText={!formData.name ? 'Product Name is required' : ''}
                sx={{ marginBottom: 2, top: 5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label='Category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.category}
                helperText={!formData.category ? 'Category is required' : ''}
                sx={{ marginBottom: 2 }}
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.category_name}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Price'
                name='price'
                value={formData.price}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.price || isNaN(formData.price) || formData.price <= 0}
                helperText={
                  !formData.price
                    ? 'Price is required'
                    : isNaN(formData.price)
                    ? 'Price must be a number'
                    : formData.price <= 0
                    ? 'Price must be greater than 0'
                    : ''
                }
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label='In Stock'
                name='in_stock'
                value={formData.in_stock}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.in_stock}
                helperText={!formData.in_stock ? 'In Stock status is required' : ''}
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value={'Yes'}>Yes</MenuItem>
                <MenuItem value={'No'}>No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label='Status'
                name='status'
                value={formData.status}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.status}
                helperText={!formData.status ? 'Status is required' : ''}
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value='new'>New</MenuItem>
                <MenuItem value='sale'>Sale</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateOrUpdateCategory}
            color='primary'
            variant='contained'
            disabled={!isProductFormValid()}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='primary' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={handleAlertClose}
          severity={alertSeverity}
        >
          <AlertTitle>{alertSeverity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}
