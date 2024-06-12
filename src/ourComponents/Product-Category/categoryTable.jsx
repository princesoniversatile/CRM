import React, { useState, useEffect, useCallback } from 'react'
import { MdAdd as AddIcon, MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Snackbar,
  Slide,
  CircularProgress,
} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import axios from 'axios'
import { Container } from '@mui/system'
import { AiOutlineShopping, AiOutlineBlock } from 'react-icons/ai'
import SvgColor from 'src/components/svg-color'

const columns = (handleEditClick, handleDeleteClick) => [
  // { field: 'id', headerName: 'ID', width: 90 },
  { field: 'category_name', headerName: 'Category Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: params => (
      <>
        <IconButton onClick={() => handleEditClick(params.row)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteClick(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
]

const EditToolbar = ({ setOpenDialog }) => (
  <GridToolbarContainer>
    <Button color='primary' startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
      Add record
    </Button>
  </GridToolbarContainer>
)

const ProductCategoryTable = () => {
  const [categories, setCategories] = useState([])
  const [searchText, setSearchText] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleteCategoryId, setDeleteCategoryId] = useState(null)
  const [newCategory, setNewCategory] = useState({ id: null, category_name: '', description: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/categories`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = e => {
    setSearchText(e.target.value)
  }

  const filteredCategories = categories.filter(
    category =>
      category.category_name.toLowerCase().includes(searchText.toLowerCase()) ||
      category.description.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleCreateOrUpdateCategory = async () => {
    if (!newCategory.category_name.trim() || !newCategory.description.trim()) {
      handleSnackbarOpen('Please enter both category name and description.', 'error')
      return
    }

    try {
      let response
      if (isEditing) {
        response = await axios.put(
          `${import.meta.env.VITE_API}/categories/${newCategory.id}`,
          newCategory
        )
        setCategories(categories.map(cat => (cat.id === newCategory.id ? response.data : cat)))
        handleSnackbarOpen('Category updated successfully.', 'success')
      } else {
        response = await axios.post(`${import.meta.env.VITE_API}/categories`, newCategory)
        setCategories([...categories, response.data])
        handleSnackbarOpen('Category created successfully.', 'success')
      }

      setOpenDialog(false)
      setNewCategory({ id: null, category_name: '', description: '' })
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving category:', error.message)
      handleSnackbarOpen('Error saving category. Please try again.', 'error')
    }
  }

  const handleEditClick = useCallback(category => {
    setNewCategory(category)
    setIsEditing(true)
    setOpenDialog(true)
  }, [])

  const handleDeleteClick = useCallback(id => {
    setDeleteCategoryId(id)
    setConfirmDeleteOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/categories/${deleteCategoryId}`)
      setCategories(categories.filter(cat => cat.id !== deleteCategoryId))
      handleSnackbarOpen('Category deleted successfully.', 'success')
    } catch (error) {
      console.error('Error deleting category:', error.message)
      handleSnackbarOpen('Error deleting category. Please try again.', 'error')
    } finally {
      setConfirmDeleteOpen(false)
      setDeleteCategoryId(null)
    }
  }, [categories, deleteCategoryId])

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  return (
    <Container>
      <div
        style={{
          marginBottom: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
       <SvgColor
            src={`/assets/icons/navbar/ic_pro_cat.svg`}
            sx={{ width: 40, height: 40, marginRight: 2 }}
          />
        <Typography variant='h4' gutterBottom marginBottom={1} style={{ flex: 1 }}>
         
          Product Category
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            setNewCategory({ id: null, category_name: '', description: '' })
            setIsEditing(false)
            setOpenDialog(true)
          }}
          color='inherit'
        >
          Add New Category
        </Button>
      </div>

      <div style={{ marginBottom: 5 }}>
        <TextField
          label='Search'
          value={searchText}
          onChange={handleSearch}
          placeholder='search...'
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
        ) : filteredCategories.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <AiOutlineBlock style={{ fontSize: '48px' }} />
              <Typography variant='body1' style={{ marginTop: '10px' }}>
                No category found !!
              </Typography>
            </div>
          </div>
        ) : (
          <DataGrid
            rows={filteredCategories}
            columns={columns(handleEditClick, handleDeleteClick)}
            pageSize={5}
            components={{ Toolbar: EditToolbar }}
            componentsProps={{ toolbar: { setOpenDialog } }}
          />
        )}
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Category' : 'Create New Category'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Category Name'
                value={newCategory.category_name}
                sx={{ top: '5px' }}
                onChange={e => setNewCategory({ ...newCategory, category_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label='Description'
                value={newCategory.description}
                onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateOrUpdateCategory} color='primary' variant='contained'>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Are you sure you want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='primary' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Slide}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

export default ProductCategoryTable
