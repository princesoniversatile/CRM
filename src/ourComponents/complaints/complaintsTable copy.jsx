import * as React from 'react'
import { MdAdd as AddIcon } from 'react-icons/md'
import { MdEdit as EditIcon } from 'react-icons/md'
import { MdSave as SaveIcon } from 'react-icons/md'
import { MdClose as CancelIcon } from 'react-icons/md'
import { MdDeleteOutline as DeleteIcon } from 'react-icons/md'

import Box from '@mui/material/Box'
import { Container } from '@mui/system'
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from '@mui/x-data-grid'

// Ye function randomly ek role return karta hai
const randomStatus = () => {
  const statuses = ['Pending', 'In Progress', 'Resolved', 'Closed']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Initial rows for the grid
const initialRows = [
  {
    id: 1,
    'customer-name': 'John Doe',
    'complain-date': new Date('2024-05-13'),
    'complaint-type': 'Claim',
    title: 'Complain 1',
    description: 'This is the first Complain.',
    status: 'Pending',
  },
  {
    id: 2,
    'customer-name': 'Jane Smith',
    'complain-date': new Date('2024-05-08'),
    'complaint-type': 'Repair',
    title: 'Complain 2',
    description: 'This is the second Complain.',
    status: 'In Progress',
  },
  {
    id: 3,
    'customer-name': 'Alice Johnson',
    'complain-date': new Date('2024-05-12'),
    'complaint-type': 'Warranty',
    title: 'Complain 3',
    description: 'This is the third Complain.',
    status: 'Resolved',
  },
  {
    id: 4,
    'customer-name': 'Bob Brown',
    'complain-date': new Date('2024-05-09'),
    'complaint-type': 'Other',
    title: 'Complain 4',
    description: 'This is the fourth Complain.',
    status: 'Closed',
  },
  {
    id: 5,
    'customer-name': 'Eve Wilson',
    'complain-date': new Date('2024-05-11'),
    'complaint-type': 'Claim',
    title: 'Complain 5',
    description: 'This is the fifth Complain.',
    status: 'Pending',
  },
]

// Edit toolbar component
function EditToolbar (props) {
  // eslint-disable-next-line react/prop-types
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

export default function ComplaintsGrid () {
  const [rows, setRows] = React.useState(initialRows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  // Function to handle stopping row edit
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  // Function to handle edit click
  const handleEditClick = id => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  // Function to handle save click
  const handleSaveClick = id => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  // Function to handle delete click
  const handleDeleteClick = id => () => {
    setRows(rows.filter(row => row.id !== id))
  }

  // Function to handle cancel click
  const handleCancelClick = id => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find(row => row.id === id)
    if (editedRow.isNew) {
      setRows(rows.filter(row => row.id !== id))
    }
  }

  // Function to process row update
  const processRowUpdate = newRow => {
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map(row => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  // Function to handle row modes model change
  const handleRowModesModelChange = newRowModesModel => {
    setRowModesModel(newRowModesModel)
  }

  // Columns for the grid

  const columns = [
    { field: 'customer-name', headerName: 'Customer Name', width: 180, editable: true },
    {
      field: 'complain-date',
      headerName: 'Complain Date',
      width: 130,
      editable: true,
      type: 'date',
    },
    {
      field: 'complaint-type',
      headerName: 'Complain Type',
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Claim', 'Warranty', 'Repair', 'Other'],
    },
    { field: 'title', headerName: 'Title', width: 130, editable: true },
    { field: 'description', headerName: 'Description', width: 200, editable: true },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Pending', 'In Progress', 'Resolved'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 130,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
          />,
        ]
      },
    },
  ]

  return (
    <Container>
      <Typography variant='h4' sx={{ mb: 8 }}>
        Complaints
      </Typography>
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <Grid container spacing={3}>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode='row'
            
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
              GridToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel, showQuickFilter: true },
            }}
          />
        </Grid>
      </Box>
    </Container>
  )
}
