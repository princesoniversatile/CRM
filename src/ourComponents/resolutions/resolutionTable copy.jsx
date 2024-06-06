import * as React from 'react'
import { Container, Typography, Button } from '@mui/material'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from '@mui/x-data-grid'

const ResolutionsTable = () => {
  // Initial rows for the grid
  const initialRows = [
    {
      id: 1,
      'complaint-name': 'Complaint 1',
      'resolution-description': 'Resolution for complaint 1',
      'resolved-by': 'John Doe',
      'resolution-date': '2024-05-15',
      'resolution-status': 'Open',
    },
    {
      id: 2,
      'complaint-name': 'Complaint 2',
      'resolution-description': 'Resolution for complaint 2',
      'resolved-by': 'Jane Smith',
      'resolution-date': '2024-05-16',
      'resolution-status': 'Closed',
    },
    {
      id: 3,
      'complaint-name': 'Complaint 3',
      'resolution-description': 'Resolution for complaint 3',
      'resolved-by': 'Alice Johnson',
      'resolution-date': '2024-05-17',
      'resolution-status': 'Pending',
    },
    {
      id: 4,
      'complaint-name': 'Complaint 4',
      'resolution-description': 'Resolution for complaint 4',
      'resolved-by': 'Bob Brown',
      'resolution-date': '2024-05-18',
      'resolution-status': 'Closed',
    },
    {
      id: 5,
      'complaint-name': 'Complaint 5',
      'resolution-description': 'Resolution for complaint 5',
      'resolved-by': 'Eve Wilson',
      'resolution-date': '2024-05-19',
      'resolution-status': 'Pending',
    },
  ]

  const [rows, setRows] = React.useState(initialRows)

  // Columns for the grid
  const columns = [
    {
      field: 'complaint-name',
      headerName: 'Complaint Name',
      width: 180,
      type: 'singleSelect',
      editable: true,
      valueOptions: ['Complaint 1', 'Complaint 2', 'Complaint 3','Complaint 4','Complaint 5'],
    },
    {
      field: 'resolution-description',
      headerName: 'Resolution Description',
      width: 250,
      editable: true,
    },
    { field: 'resolved-by', headerName: 'Resolved By', width: 150, editable: true },
    { field: 'resolution-date', headerName: 'Resolution Date', width: 150, editable: true },
    {
      field: 'resolution-status',
      headerName: 'Resolution Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Open', 'Closed', 'Pending'],
    },
  ]

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4' align='center' gutterBottom>
        Post-Sales Resolutions
      </Typography>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          components={{
            Toolbar: CustomToolbar,
          }}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          editable
        />
      </div>
    </Container>
  )
}

// Custom Toolbar component for the DataGrid
function CustomToolbar () {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

export default ResolutionsTable
