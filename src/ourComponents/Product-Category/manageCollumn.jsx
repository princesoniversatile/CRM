import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Checkbox, MenuItem, Select } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'firstName', headerName: 'First name', width: 150 },
  { field: 'lastName', headerName: 'Last name', width: 150 },
  { field: 'age', headerName: 'Age', type: 'number', width: 90 },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function ProductCategoryTable() {
  const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.field));
  const [open, setOpen] = useState(false);

  const handleColumnToggle = (field) => {
    if (visibleColumns.includes(field)) {
      setVisibleColumns(visibleColumns.filter(col => col !== field));
    } else {
      setVisibleColumns([...visibleColumns, field]);
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button onClick={() => setOpen(!open)}>{open ? 'Close Columns' : 'Manage Columns'}</Button>
      {open && (
        <div style={{ marginTop: 10 }}>
          {columns.map(col => (
            <label key={col.field} style={{ marginRight: 10 }}>
              <Checkbox
                checked={visibleColumns.includes(col.field)}
                onChange={() => handleColumnToggle(col.field)}
              />
              {col.headerName}
            </label>
          ))}
        </div>
      )}
      <DataGrid
        rows={rows}
        columns={columns.filter(col => visibleColumns.includes(col.field))}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </div>
  );
}
