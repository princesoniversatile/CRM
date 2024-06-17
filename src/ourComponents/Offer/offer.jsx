import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { MdAdd as AddIcon } from 'react-icons/md'
import { MdEdit as EditIcon } from 'react-icons/md'
import { MdDeleteOutline as DeleteIcon } from 'react-icons/md'
import {
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Toolbar,
  TablePagination,
} from '@mui/material'
import { Container } from '@mui/system'
import axios from 'axios'
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import SvgColor from 'src/components/svg-color'

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Random Offer Types
const offerTypes = ['Discount', 'Deal', 'Other']

// Fetch offers from API
const fetchOffers = async () => {
  try {
    const response = await api.get('/offers')
    return response.data.map(offer => ({
      id: offer.id,
      offerName: offer.name,
      offerDescription: offer.description,
      offerStartDate: new Date(offer.start_date), // Convert date string to Date object
      offerEndDate: new Date(offer.end_date), // Convert date string to Date object
      offerType: offer.type,
      offerAmount: offer.amount,
    }))
  } catch (error) {
    console.error('Failed to fetch offers:', error)
    return []
  }
}

// Add offer via API
const addOffer = async newOffer => {
  try {
    let postData = {
      name: newOffer.offerName,
      description: newOffer.offerDescription,
      start_date: new Date(newOffer.offerStartDate),
      end_date: new Date(newOffer.offerEndDate),
      amount: newOffer.offerAmount,
    }

    if (newOffer.offerType === 'Other') {
      postData = {
        ...postData,
        type: newOffer.offerTypeOther, // Use offerTypeOther when offerType is 'Other'
      }
    } else {
      postData = {
        ...postData,
        type: newOffer.offerType, // Use offerType directly when it's not 'Other'
      }
    }

    const response = await api.post('/offers', postData)
    return {
      ...newOffer,
      id: response.data.id,
      isNew: false,
    }
  } catch (error) {
    console.error('Failed to add offer:', error)
    return null
  }
}

// Update offer via API
const updateOffer = async (id, updatedOffer) => {
  try {
    await api.put(`/offers/${id}`, {
      name: updatedOffer.offerName,
      description: updatedOffer.offerDescription,
      start_date: updatedOffer.offerStartDate.toISOString(), // Convert Date object to ISO string
      end_date: updatedOffer.offerEndDate.toISOString(), // Convert Date object to ISO string
      type: updatedOffer.offerType,
      amount: updatedOffer.offerAmount,
    })
    return updatedOffer
  } catch (error) {
    console.error('Failed to update offer:', error)
    return null
  }
}

// Delete offer via API
const deleteOffer = async id => {
  try {
    await api.delete(`/offers/${id}`)
  } catch (error) {
    console.error('Failed to delete offer:', error)
  }
}

function EditToolbar (props) {
  const { handleAddClick } = props
  return (
    <GridToolbarContainer>
      {/* <Button color='inherit' startIcon={<AddIcon />} onClick={handleAddClick}>
        Add Offer
      </Button> */}
    </GridToolbarContainer>
  )
}

export default function FullFeaturedCrudGrid () {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [rows, setRows] = useState([])
  const [rowModesModel, setRowModesModel] = React.useState({})
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: '' })
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [currentRow, setCurrentRow] = React.useState({})
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState(null)

  React.useEffect(() => {
    const loadOffers = async () => {
      const offers = await fetchOffers()
      setRows(offers)
    }
    loadOffers()
  }, [])

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = row => () => {
    setCurrentRow(row)
    setIsEditMode(true)
    setDialogOpen(true)
  }

  const handleAddClick = () => {
    setCurrentRow({
      offerName: '',
      offerDescription: '',
      offerStartDate: new Date(), // Initialize with current date
      offerEndDate: new Date(), // Initialize with current date
      offerType: '',
      offerAmount: '',
    })
    setIsEditMode(false)
    setDialogOpen(true)
  }

  const handleSaveClick = async () => {
    if (isEditMode) {
      const updatedRow = await updateOffer(currentRow.id, currentRow)
      if (updatedRow) {
        setRows(rows.map(row => (row.id === currentRow.id ? updatedRow : row)))
        setSnackbar({ open: true, message: 'Offer updated successfully!', severity: 'success' })
      } else {
        setSnackbar({ open: true, message: 'Failed to update offer.', severity: 'error' })
      }
    } else {
      const newRow = await addOffer(currentRow)
      if (newRow) {
        setRows([...rows, newRow])
        setSnackbar({ open: true, message: 'Offer added successfully!', severity: 'success' })
      } else {
        setSnackbar({ open: true, message: 'Failed to add offer.', severity: 'error' })
      }
    }
    setDialogOpen(false)
  }

  const handleDeleteClick = id => () => {
    setDeleteId(id)
    setConfirmDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    await deleteOffer(deleteId)
    setRows(rows.filter(row => row.id !== deleteId))
    setSnackbar({ open: true, message: 'Offer deleted successfully!', severity: 'success' })
    setConfirmDialogOpen(false)
  }

  const handleCancelClick = () => {
    setDialogOpen(false)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setCurrentRow({ ...currentRow, [name]: value })
  }

  const columns = [
    { field: 'offerName', headerName: 'Offer Name', width: 150 },
    { field: 'offerDescription', headerName: 'Offer Description', width: 290 },
    { field: 'offerStartDate', headerName: 'Offer Start Date', type: 'date', width: 130 },
    { field: 'offerEndDate', headerName: 'Offer End Date', type: 'date', width: 130 },
    { field: 'offerType', headerName: 'Offer Type', width: 100 },
    { field: 'offerAmount', headerName: 'Offer Amount', width: 100 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Edit'
          onClick={handleEditClick(row)}
          color='inherit'
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Delete'
          onClick={handleDeleteClick(row.id)}
          color='inherit'
        />,
      ],
    },
  ]

  return (
    <Container>
      <Box
        sx={{
          height: 450,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <Toolbar>
          <Typography variant='h4' style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <SvgColor
              src={`/assets/icons/navbar/ic_offer.svg`}
              sx={{ width: 50, height: 30, marginRight: 2 }}
            />
            Offers
          </Typography>
          <Button
            variant='contained'
            color='inherit'
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            style={{ marginLeft: 'auto' }}
          >
            Add Offer
          </Button>
        </Toolbar>
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
        <DataGrid
          // rows={rows}
          // columns={columns}
          // editMode='row'
          // rowModesModel={rowModesModel}
          // onRowEditStop={handleRowEditStop}
          // slots={{
          //   toolbar: EditToolbar,
          // }}
          // slotProps={{
          //   toolbar: { handleAddClick },
          // }}
          rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          columns={columns}
          // columns={columns(handleEditClick, handleDeleteClick)}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowEditStop={handleRowEditStop}
          slots={{
            toolbar: EditToolbar,
          }}
          pageSize={rowsPerPage}
          onPageChange={params => setPage(params.page)}
          onPageSizeChange={params => setRowsPerPage(params.pageSize)}
          pagination
          // components={{ Toolbar: GridToolbar }}
          autoHeight={false}
          // loading={loading}
          pageSizeOptions={[5,10,15, 1000]}

          sx={{ height: '380px' }}
        />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleCancelClick}>
        <DialogTitle>{isEditMode ? 'Edit Offer' : 'Add Offer'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill out the offer details below.</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            name='offerName'
            label='Offer Name'
            type='text'
            fullWidth
            variant='standard'
            value={currentRow.offerName}
            onChange={handleInputChange}
          />
          <TextField
            margin='dense'
            name='offerDescription'
            label='Offer Description'
            type='text'
            fullWidth
            variant='standard'
            value={currentRow.offerDescription}
            onChange={handleInputChange}
          />
          <TextField
            margin='dense'
            name='offerStartDate'
            label='Offer Start Date'
            type='date'
            fullWidth
            variant='standard'
            value={
              currentRow.offerStartDate
                ? new Date(currentRow.offerStartDate).toISOString().split('T')[0]
                : ''
            }
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin='dense'
            name='offerEndDate'
            label='Offer End Date'
            type='date'
            fullWidth
            variant='standard'
            value={
              currentRow.offerEndDate
                ? new Date(currentRow.offerEndDate).toISOString().split('T')[0]
                : ''
            }
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            margin='dense'
            name='offerType'
            select
            label='Offer Type'
            fullWidth
            variant='standard'
            value={currentRow.offerType}
            onChange={e => {
              const { value } = e.target
              if (value === 'Other') {
                setCurrentRow({ ...currentRow, offerType: 'Other', offerTypeOther: '' })
              } else {
                setCurrentRow({ ...currentRow, offerType: value })
              }
            }}
          >
            {offerTypes.map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
            <MenuItem value='Other'>Type manually</MenuItem>
          </TextField>

          {currentRow.offerType === 'Other' && (
            <TextField
              margin='dense'
              name='offerTypeOther'
              label='Offer Type'
              fullWidth
              variant='standard'
              value={currentRow.offerTypeOther}
              onChange={e => setCurrentRow({ ...currentRow, offerTypeOther: e.target.value })}
            />
          )}

          <TextField
            margin='dense'
            name='offerAmount'
            label='Offer Amount (%)'
            type='number'
            fullWidth
            variant='standard'
            value={currentRow.offerAmount}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick}>Cancel</Button>
          <Button onClick={handleSaveClick}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this offer?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
