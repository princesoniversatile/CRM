import React, { useState, useRef, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Checkbox, Box, Typography, IconButton } from '@mui/material';
import { MdMoreVert as ArrowDropDownIcon } from "react-icons/md";
import Label from 'src/components/label';


const columns = [
  { field: 'firstName', headerName: 'First name', width: 150, isDefault: true },
  { field: 'lastName', headerName: 'Last name', width: 150, isDefault: true },
  { field: 'age', headerName: 'Age', type: 'number', width: 90 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Phone', width: 150 },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, email: 'jon@example.com', phone: '1234567890' },
];

export default function ProductCategoryTable() {
  const [visibleColumns, setVisibleColumns] = useState(columns.filter(col => col.isDefault).map(col => col.field));
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleColumnToggle = (field) => {
    setVisibleColumns(prev => prev.includes(field) ? prev.filter(col => col !== field) : [...prev, field]);
  };

  const handleShowHideAll = () => {
    if (visibleColumns.length === columns.length) {
      setVisibleColumns(columns.filter(col => col.isDefault).map(col => col.field));
    } else {
      setVisibleColumns(columns.map(col => col.field));
    }
  };

  const handleReset = () => {
    setVisibleColumns(columns.filter(col => col.isDefault).map(col => col.field));
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Product Category Table</Typography>
        <Box position="relative">
          <IconButton onClick={() => setOpen(!open)}>
            <Label>Show More..</Label><ArrowDropDownIcon />
          </IconButton>
          {open && (
            <Box 
              position="absolute" 
              top={30} 
              right={0} 
              bgcolor="background.paper" 
              boxShadow={3} 
              borderRadius={1} 
              p={2} 
              zIndex={1}
              ref={menuRef}
            >
              {columns.map(col => (
                <Box key={col.field} display="flex" alignItems="center">
                  <Checkbox
                    checked={visibleColumns.includes(col.field)}
                    onChange={() => handleColumnToggle(col.field)}
                    disabled={col.isDefault}
                  />
                  {col.headerName}
                </Box>
              ))}
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                <Checkbox
                  checked={visibleColumns.length === columns.length}
                  onChange={handleShowHideAll}
                />
                <Typography variant="body2">Show/Hide All</Typography>
                <Button onClick={handleReset} size="small">Reset</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns.filter(col => visibleColumns.includes(col.field))}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </div>
  );
}
