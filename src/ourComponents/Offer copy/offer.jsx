import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { MdAdd as AddIcon } from 'react-icons/md';
import { MdEdit as EditIcon } from 'react-icons/md';
import { MdDeleteOutline as DeleteIcon } from 'react-icons/md';
import { MdSave as SaveIcon } from 'react-icons/md';
import { MdClose as CancelIcon } from 'react-icons/md';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { Container } from '@mui/system';

// Random Offer Types
const offerTypes = ['Discount', 'Deal', 'Other'];
const randomOfferType = () => {
  return offerTypes[Math.floor(Math.random() * offerTypes.length)];
};

// Function to generate random dates
const randomDate = () => {
  const start = new Date(2022, 0, 1); // January 1, 2022
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Initial Rows
const initialRows = [
  {
    id: 1,
    offerName: 'Summer Sale',
    offerDescription: 'Get up to 50% off on summer collection',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '50%',
  },
  {
    id: 2,
    offerName: 'Black Friday Deal',
    offerDescription: 'Exclusive Black Friday deals up to 70%',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '70%',
  },
  {
    id: 3,
    offerName: 'New Year Discount',
    offerDescription: 'Celebrate New Year with 30% off',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '30%',
  },
  {
    id: 4,
    offerName: 'Holiday Special',
    offerDescription: 'Holiday deals up to 40%',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '40%',
  },
  {
    id: 5,
    offerName: 'Flash Sale',
    offerDescription: 'Limited time flash sale with 60% off',
    offerStartDate: randomDate(),
    offerEndDate: randomDate(),
    offerType: randomOfferType(),
    offerAmount: '60%',
  },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = Date.now(); // Generate a unique timestamp-based ID
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        offerName: '',
        offerDescription: '',
        offerStartDate: '',
        offerEndDate: '',
        offerType: '',
        offerAmount: '',
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'offerName' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClick}
      >
        Add Offer
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'offerName', headerName: 'Offer Name', width: 150, editable: true },
    {
      field: 'offerDescription',
      headerName: 'Offer Description',
      width: 290,
      editable: true,
    },
    {
      field: 'offerStartDate',
      headerName: 'Offer Start Date',
      type: 'date',
      width: 130,
      editable: true,
    },
    {
      field: 'offerEndDate',
      headerName: 'Offer End Date',
      type: 'date',
      width: 130,
      editable: true,
    },
    {
      field: 'offerType',
      headerName: 'Offer Type',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: offerTypes,
    },
    {
      field: 'offerAmount',
      headerName: 'Offer Amount',
      width: 100,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

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
      <Typography variant="h4" component="h2" gutterBottom>
        Offer Section
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
    </Container>
  );
}
