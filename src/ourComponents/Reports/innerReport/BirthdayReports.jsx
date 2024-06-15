import { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { TablePagination } from '@mui/material'

const rows = [
  { id: 1, username: '@MUI1', age: 38, desk: 'D-546' },
  { id: 2, username: '@MUI2', age: 25, desk: 'D-042' },
  { id: 3, username: '@MUI3', age: 30, desk: 'D-123' },
  { id: 4, username: '@MUI4', age: 29, desk: 'D-456' },
  { id: 5, username: '@MUI5', age: 28, desk: 'D-789' },
  { id: 6, username: '@MUI6', age: 27, desk: 'D-012' },
  { id: 7, username: '@MUI7', age: 26, desk: 'D-345' },
  { id: 8, username: '@MUI8', age: 25, desk: 'D-678' },
  { id: 9, username: '@MUI9', age: 24, desk: 'D-901' },
  { id: 10, username: '@MUI10', age: 23, desk: 'D-234' },
  { id: 11, username: '@MUI11', age: 22, desk: 'D-567' },
  { id: 12, username: '@MUI12', age: 21, desk: 'D-890' },
  { id: 13, username: '@MUI13', age: 20, desk: 'D-123' },
  { id: 14, username: '@MUI14', age: 19, desk: 'D-456' },
  { id: 15, username: '@MUI15', age: 18, desk: 'D-789' },
  { id: 16, username: '@MUI16', age: 38, desk: 'D-546' },
  { id: 17, username: '@MUI17', age: 25, desk: 'D-042' },
  { id: 18, username: '@MUI18', age: 30, desk: 'D-123' },
  { id: 19, username: '@MUI19', age: 29, desk: 'D-456' },
  { id: 20, username: '@MUI20', age: 28, desk: 'D-789' },
  { id: 21, username: '@MUI21', age: 27, desk: 'D-012' },
  { id: 22, username: '@MUI22', age: 26, desk: 'D-345' },
  { id: 23, username: '@MUI23', age: 25, desk: 'D-678' },
  { id: 24, username: '@MUI24', age: 24, desk: 'D-901' },
  { id: 25, username: '@MUI25', age: 23, desk: 'D-234' },
  { id: 26, username: '@MUI26', age: 22, desk: 'D-567' },
  { id: 27, username: '@MUI27', age: 21, desk: 'D-890' },
  { id: 28, username: '@MUI28', age: 20, desk: 'D-123' },
  { id: 29, username: '@MUI29', age: 19, desk: 'D-456' },
  { id: 30, username: '@MUI30', age: 18, desk: 'D-789' },
  { id: 31, username: '@MUI31', age: 38, desk: 'D-546' },
  { id: 32, username: '@MUI32', age: 25, desk: 'D-042' },
  { id: 33, username: '@MUI33', age: 30, desk: 'D-123' },
  { id: 34, username: '@MUI34', age: 29, desk: 'D-456' },
  { id: 35, username: '@MUI35', age: 28, desk: 'D-789' },
  { id: 36, username: '@MUI36', age: 27, desk: 'D-012' },
  { id: 37, username: '@MUI37', age: 26, desk: 'D-345' },
  { id: 38, username: '@MUI38', age: 25, desk: 'D-678' },
  { id: 39, username: '@MUI39', age: 24, desk: 'D-901' },
  { id: 40, username: '@MUI40', age: 23, desk: 'D-234' },
  { id: 41, username: '@MUI41', age: 22, desk: 'D-567' },
  { id: 42, username: '@MUI42', age: 21, desk: 'D-890' },
  { id: 43, username: '@MUI43', age: 20, desk: 'D-123' },
  { id: 44, username: '@MUI44', age: 19, desk: 'D-456' },
  { id: 45, username: '@MUI45', age: 18, desk: 'D-789' },
  { id: 46, username: '@MUI46', age: 38, desk: 'D-546' },
  { id: 47, username: '@MUI47', age: 25, desk: 'D-042' },
  { id: 48, username: '@MUI48', age: 30, desk: 'D-123' },
  { id: 49, username: '@MUI49', age: 29, desk: 'D-456' },
  { id: 50, username: '@MUI50', age: 28, desk: 'D-789' },
]

export default function BirthdayReports () {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  return (
    <>
      <TablePagination
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
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          columns={[
            { field: 'username', headerName: 'Username', width: 150 },
            { field: 'age', headerName: 'Age', width: 100 },
            { field: 'desk', headerName: 'Desk', width: 150 },
          ]}
          rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          pageSize={rowsPerPage}
          // pageSizeOptions={[5, 10, 15]}
          // rowsPerPageOptions={[5, 10, 25, 50, 70]}
        />
      </div>
    </>
  )
}
