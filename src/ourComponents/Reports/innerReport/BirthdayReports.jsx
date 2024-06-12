import * as React from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 38,
    desk: 'D-546',
  },
  {
    id: 2,
    username: '@MUI-X',
    age: 25,
    desk: 'D-042',
  },
  {
    id: 3,
    username: '@MUI-X',
    age: 25,
    desk: 'D-042',
  },
  {
    id: 4,
    username: '@MUI-X',
    age: 25,
    desk: 'D-042',
  },
]

export default function BirthdayReports () {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'username', hideable: true }, { field: 'age' }, { field: 'desk' }]}
        rows={rows}
        slots={{
          toolbar: GridToolbar,
        }}
        pageSizeOptions={[1, 2, 3]}
      />
    </div>
  )
}
