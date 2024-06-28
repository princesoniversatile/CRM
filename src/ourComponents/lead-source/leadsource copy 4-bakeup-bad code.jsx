import React, { useEffect, useState, useRef } from 'react'
import api from 'src/utils/api'
import MuiAlert from '@mui/material/Alert'
import { MdDashboardCustomize as ArrowDropDownIcon } from 'react-icons/md'
import { MdAdd as AddIcon, MdExpandMore as ExpandMore, MdEdit as Edit, MdDelete as Delete } from 'react-icons/md'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  MenuItem,
  DialogActions,
  Snackbar,
  AlertTitle,
  Slide,
  OutlinedInput,
  InputAdornment,
  Fade,
} from '@mui/material'
import { Container, Stack } from '@mui/system'
import { Link as RouterLink } from 'react-router-dom'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { parseISO, format } from 'date-fns'
import SvgColor from 'src/components/svg-color'
import Iconify from 'src/components/iconify'
import Label from 'src/components/label'

function SlideTransition(props) {
  return <Slide {...props} direction='up' />
}

const LeadSourcePage = () => {
  const [visibleColumns, setVisibleColumns] = useState([])
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const handleColumnToggle = (field) => {
    setVisibleColumns((prev) =>
      prev.includes(field) ? prev.filter((col) => col !== field) : [...prev, field]
    )
  }

  const handleShowHideAll = () => {
    if (visibleColumns.length === columns().length) {
      setVisibleColumns([])
    } else {
      setVisibleColumns(columns().map((col) => col.field))
    }
  }

  const handleReset = () => {
    setVisibleColumns([])
  }

  const [openDialog, setOpenDialog] = useState(false)
  const [leads, setLeads] = useState([])
  const [currentLeadId, setCurrentLeadId] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [newFollowUpRemarks, setNewFollowUpRemarks] = useState('')
  const [newNextFollowUpDate, setNewNextFollowUpDate] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')

  const [formData, setFormData] = useState({
    lead_name: '',
    lead_type: '',
    company_name: '',
    email: '',
    phone_number: '',
    status: '',
  })

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleRowClick = (leadId) => {
    setExpanded(expanded === leadId ? false : leadId)
  }

  const handleLeadNameChange = (e) => {
    const selectedLead = leads.find((lead) => lead.lead_name === e.target.value)
    setFormData({
      lead_name: selectedLead.lead_name,
      lead_type: '',
      company_name: selectedLead.company_name,
      email: selectedLead.email,
      phone_number: selectedLead.phone_number,
      status: '',
    })
  }

  const handleToggle = () => {
    setOpen(!open)
  }

  const fetchLeads = async () => {
    try {
      const response = await api.get(`/leads-with-history`)
      const fetchedData = response.data.map((item) => ({
        id: item.id,
        lead_name: item.lead_name,
        lead_date: item.lead_date,
        lead_type: item.lead_type,
        company_name: item.company_name,
        email: item.email,
        status: item.status,
        phone_number: item.phone_number,
        history: item.history,
      }))

      setRows(fetchedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching leads:', error)
      setLoading(false)
    }
  }

  const fetchLeadNames = async () => {
    try {
      const response = await api.get('/leads-with-history')
      setLeads(response.data)
    } catch (error) {
      console.error('Error fetching lead names:', error)
    }
  }

  useEffect(() => {
    fetchLeads()
    fetchLeadNames()
  }, [])

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase()
    setSearchText(value)
  }

  const filteredRows = rows.filter(
    (row) =>
      (row.lead_name && row.lead_name.toLowerCase().includes(searchText)) ||
      (row.lead_type && row.lead_type.toLowerCase().includes(searchText)) ||
      (row.company_name && row.company_name.toLowerCase().includes(searchText)) ||
      (row.email && row.email.toLowerCase().includes(searchText)) ||
      (row.phone_number && row.phone_number.toString().includes(searchText)) ||
      (row.status && row.status.toLowerCase().includes(searchText))
  )

  const handleDeleteClick = (id) => {
    setCurrentLeadId(id)
    setConfirmDeleteOpen(true)
  }

  const handleCreateOrUpdateLead = async () => {
    try {
      let response
      const dataToSend = { ...formData }

      if (formData.follow_up instanceof Date) {
        dataToSend.follow_up = formData.follow_up.toISOString().split('T')[0]
      } else {
        delete dataToSend.follow_up
      }

      if (isEditing) {
        response = await api.put(`/leads/${currentLeadId}`, dataToSend)
        setAlertMessage('Lead updated successfully!')
      } else {
        response = await api.post('/leads', dataToSend)
        setAlertMessage('Lead added successfully!')
      }
      setAlertSeverity('success')
      fetchLeads()
    } catch (error) {
      setAlertMessage('Failed to add/update lead')
      setAlertSeverity('error')
      console.error('Error adding/updating lead:', error)
    }
    setAlertOpen(true)
    setOpenDialog(false)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/leads/${currentLeadId}`)
      setAlertMessage('Lead deleted successfully!')
      setAlertSeverity('success')
      fetchLeads()
    } catch (error) {
      setAlertMessage('Failed to delete lead')
      setAlertSeverity('error')
      console.error('Error deleting lead:', error)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleFollowUpDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      follow_up: date,
    }))
  }

  const handleOpenDialog = () => {
    setIsEditing(false)
    setFormData({
      lead_name: '',
      lead_type: '',
      company_name: '',
      email: '',
      phone_number: '',
      status: '',
      follow_up: null,
      followup_description: '',
    })
    setOpenDialog(true)
  }

  const handleAddFollowUp = (leadId) => {
    const newFollowUp = {
      date: new Date().toISOString(),
      nextFollowUpDate: newNextFollowUpDate.toISOString(),
      remarks: newFollowUpRemarks,
    }
    const lead = leads.find((lead) => lead.id === leadId)
    lead.history.push({
      ...newFollowUp,
      date: parseISO(newFollowUp.date),
      nextFollowUpDate: parseISO(newFollowUp.nextFollowUpDate),
    })
    setNewFollowUpRemarks('')
    setNewNextFollowUpDate(null)
  }

  return (
    <Container>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
        <Typography variant='h4' component='h2' gutterBottom style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <SvgColor src={`/assets/icons/navbar/ic_lead.svg`} sx={{ width: 50, height: 30, marginRight: 2 }} />
          Leads
        </Typography>
        <TextField
          label='Search Leads'
          value={searchText}
          onChange={handleSearch}
          variant='outlined'
          size='small'
          sx={{ flex: 1, marginLeft: 2, maxWidth: '300px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Iconify icon='eva:search-fill' />
              </InputAdornment>
            ),
          }}
        />
        <IconButton onClick={handleToggle}>
          <ArrowDropDownIcon />
        </IconButton>
      </Stack>

      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
        <Button variant='contained' startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Add Lead
        </Button>
        <Button variant='outlined' onClick={handleShowHideAll}>
          {visibleColumns.length === columns().length ? 'Hide All Columns' : 'Show All Columns'}
        </Button>
        <Button variant='outlined' onClick={handleReset}>
          Reset
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns()
                .filter((column) => visibleColumns.includes(column.field))
                .map((column) => (
                  <TableCell key={column.field}>
                    <Box display='flex' alignItems='center'>
                      {column.headerName}
                      <IconButton
                        size='small'
                        onClick={() => handleColumnToggle(column.field)}
                        sx={{ marginLeft: 'auto' }}
                      >
                        {visibleColumns.includes(column.field) ? <ExpandMore /> : <ArrowDropDownIcon />}
                      </IconButton>
                    </Box>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                {columns()
                  .filter((column) => visibleColumns.includes(column.field))
                  .map((column) => (
                    <TableCell key={column.field}>
                      {column.renderCell ? column.renderCell(row) : row[column.field]}
                    </TableCell>
                  ))}
                <TableCell>
                  <IconButton onClick={() => handleDeleteClick(row.id)}>
                    <Delete />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setCurrentLeadId(row.id)
                      setIsEditing(true)
                      setFormData({
                        lead_name: row.lead_name,
                        lead_type: row.lead_type,
                        company_name: row.company_name,
                        email: row.email,
                        phone_number: row.phone_number,
                        status: row.status,
                      })
                      setOpenDialog(true)
                    }}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Accordion expanded={expanded === row.id} onChange={handleChange(row.id)}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {row.history.map((historyItem, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant='body2'>
                            Date: {format(parseISO(historyItem.date), 'yyyy-MM-dd')}
                          </Typography>
                          <Typography variant='body2'>
                            Next Follow Up Date: {format(parseISO(historyItem.nextFollowUpDate), 'yyyy-MM-dd')}
                          </Typography>
                          <Typography variant='body2'>Remarks: {historyItem.remarks}</Typography>
                        </Box>
                      ))}
                      <Box display='flex' alignItems='center' mt={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label='Next Follow Up Date'
                            value={newNextFollowUpDate}
                            onChange={(date) => setNewNextFollowUpDate(date)}
                            renderInput={(params) => <TextField {...params} variant='outlined' size='small' />}
                          />
                        </LocalizationProvider>
                        <TextField
                          label='Remarks'
                          value={newFollowUpRemarks}
                          onChange={(e) => setNewFollowUpRemarks(e.target.value)}
                          variant='outlined'
                          size='small'
                          sx={{ ml: 2 }}
                        />
                        <Button variant='contained' onClick={() => handleAddFollowUp(row.id)} sx={{ ml: 2 }}>
                          Add Follow Up
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label='Lead Name'
                name='lead_name'
                value={formData.lead_name}
                onChange={handleInputChange}
                variant='outlined'
                fullWidth
                select
              >
                {leads.map((lead) => (
                  <MenuItem key={lead.lead_name} value={lead.lead_name}>
                    {lead.lead_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Lead Type'
                name='lead_type'
                value={formData.lead_type}
                onChange={handleInputChange}
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Company Name'
                name='company_name'
                value={formData.company_name}
                onChange={handleInputChange}
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Phone Number'
                name='phone_number'
                value={formData.phone_number}
                onChange={handleInputChange}
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Status'
                name='status'
                value={formData.status}
                onChange={handleInputChange}
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Follow Up'
                  value={formData.follow_up}
                  onChange={handleFollowUpDateChange}
                  renderInput={(params) => <TextField {...params} variant='outlined' fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateOrUpdateLead}>{isEditing ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this lead?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant='filled' onClose={handleAlertClose} severity={alertSeverity}>
          <AlertTitle>{alertSeverity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

const columns = () => [
  { field: 'lead_name', headerName: 'Lead Name' },
  { field: 'company_name', headerName: 'Company Name' },
  { field: 'email', headerName: 'Email' },
  { field: 'phone_number', headerName: 'Phone Number' },
  { field: 'lead_type', headerName: 'Lead Type' },
  { field: 'lead_date', headerName: 'Lead Date', renderCell: (params) => params.lead_date ? format(parseISO(params.lead_date), 'yyyy-MM-dd') : '' },
  { field: 'status', headerName: 'Status' },
]

export default LeadSourcePage
