import React, { useEffect, useState, useRef } from 'react'
import dayjs from 'dayjs'
import api from 'src/utils/api'
import MuiAlert from '@mui/material/Alert'

import { MdDashboardCustomize as ArrowDropDownIcon } from 'react-icons/md'

import {
  MdAdd as AddIcon,
  MdExpandMore as ExpandMore,
  MdEdit as Edit,
  MdDelete as Delete,
} from 'react-icons/md'

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
  TablePagination,
  Collapse,
  Chip,
} from '@mui/material'

import { Container, Stack } from '@mui/system'
import { Link as RouterLink } from 'react-router-dom'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { parseISO, format } from 'date-fns'
import SvgColor from 'src/components/svg-color'
import Iconify from 'src/components/iconify'
import Label from 'src/components/label'

function SlideTransition (props) {
  return <Slide {...props} direction='up' />
}

const getStatusColor = status => {
  switch (status.toLowerCase()) {
    case 'new':
      return 'info'
    case 'in progress':
      return 'warning'
    case 'completed':
      return 'success'
    case 'new':
      return 'info'
    case 'loose':
      return 'error'
    case 'won':
      return 'success'
    case 'on hold':
      return 'warning'
    default:
      return 'default'
  }
}

const leadsData = [
  {
    id: 1,
    name: 'Sunil Reddy',
    type: 'Twitter',
    company: 'NextGen Tech',
    LeadDate: parseISO('2024-06-17'),
    status: 'New Lead',
    history: [
      {
        date: parseISO('2024-06-17'),
        nextFollowUpDate: parseISO('2024-06-17'),
        remarks: 'Follow up 1 - Conversation added 1',
      },
      {
        date: parseISO('2024-06-18'),
        nextFollowUpDate: parseISO('2024-06-18'),
        remarks: 'Follow up 2 - Conversation added 2',
      },
    ],
  },
  {
    id: 2,
    name: 'Priya Gupta',
    type: 'LinkedIn',
    company: 'Future Technologies',
    LeadDate: parseISO('2024-06-05'),
    status: 'Contacted',
    history: [
      {
        date: parseISO('2024-06-05'),
        nextFollowUpDate: parseISO('2024-06-17'),
        remarks: 'Follow up 1 - Graphic designing work assigned',
      },
    ],
  },
  {
    id: 3,
    name: 'Amit Singh',
    type: 'Facebook',
    company: 'Tech Innovations',
    LeadDate: parseISO('2024-06-21'),
    status: 'Interested',
    history: [],
  },
  {
    id: 4,
    name: 'Riya Sharma',
    type: 'Instagram',
    company: 'Digital Solutions',
    LeadDate: parseISO('2024-06-11'),
    status: 'Negotiation',
    history: [
      {
        date: parseISO('2024-06-11'),
        nextFollowUpDate: parseISO('2024-06-17'),
        remarks: 'Follow up 1 - Requirement gathering',
      },
      {
        date: parseISO('2024-06-12'),
        nextFollowUpDate: parseISO('2024-06-17'),
        remarks: 'Follow up 2 - Quotation sent',
      },
    ],
  },
  // Add more lead data here
]

const LeadSourcePage = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [visibleColumns, setVisibleColumns] = useState(
    leadsData.filter(col => col.isDefault).map(col => col.field)
  )
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const handleColumnToggle = field => {
    setVisibleColumns(prev =>
      prev.includes(field) ? prev.filter(col => col !== field) : [...prev, field]
    )
  }

  const handleShowHideAll = () => {
    if (visibleColumns.length === columns().length) {
      setVisibleColumns(leadsData.filter(col => col.isDefault).map(col => col.field))
    } else {
      setVisibleColumns(columns().map(col => col.field))
    }
  }

  const handleReset = () => {
    setVisibleColumns(leadsData.filter(col => col.isDefault).map(col => col.field))
  }

  const handleEditClick = leadId => {
    const leadToEdit = rows.find(row => row.id === leadId)
    if (leadToEdit) {
      setFormData({
        lead_name: leadToEdit.lead_name,
        lead_type: leadToEdit.lead_type,
        company_name: leadToEdit.company_name,
        email: leadToEdit.email,
        phone_number: leadToEdit.phone_number,
        status: leadToEdit.status,
      })
      setCurrentLeadId(leadId)
      setIsEditing(true)
      setOpenDialog(true)
    }
  }

  const handleDeleteClick = leadId => {
    setCurrentLeadId(leadId)
    setConfirmDeleteOpen(true)
  }

  const [openDialog, setOpenDialog] = useState(false)
  const isLeadFormValid = () => {
    return (
      formData.lead_name &&
      formData.lead_type &&
      formData.company_name &&
      formData.email &&
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email) &&
      formData.phone_number &&
      /^\d{10}$/.test(formData.phone_number) &&
      formData.status
    )
  }
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

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleRowClick = leadId => {
    setExpanded(expanded === leadId ? false : leadId)
  }
  const handleLeadNameChange = e => {
    const selectedLead = leads.find(lead => lead.full_name === e.target.value)
    setFormData({
      lead_name: selectedLead.full_name,
      lead_type: '',
      company_name: selectedLead.company,
      email: selectedLead.email_address,
      phone_number: selectedLead.phone_number,
      status: '',
    })
  }

  const handleToggle = () => {
    setOpen(!open) // Toggle the open state
  }

  const fetchLeads = async () => {
    try {
      const response = await api.get(`/leads-with-history`)
      const fetchedData = response.data.map(item => ({
        id: item.id,
        lead_name: item.lead_name,
        lead_date: item.lead_date,
        lead_type: item.lead_type,

        company_name: item.company_name,
        email: item.email,
        phone_number: item.phone_number,
        history: item.history,
        status: item.status,
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
      const response = await api.get('/customers')
      setLeads(response.data)
    } catch (error) {
      console.error('Error fetching lead names:', error)
    }
  }

  useEffect(() => {
    fetchLeads()
    fetchLeadNames()
  }, [])

  const handleSearch = event => {
    const value = event.target.value.toLowerCase()
    setSearchText(value)
  }

  const filteredRows = rows.filter(
    row =>
      (row.lead_name && row.lead_name.toLowerCase().includes(searchText)) ||
      (row.lead_type && row.lead_type.toLowerCase().includes(searchText)) ||
      (row.company_name && row.company_name.toLowerCase().includes(searchText)) ||
      (row.email && row.email.toLowerCase().includes(searchText)) ||
      (row.phone_number && row.phone_number.toString().includes(searchText)) ||
      (row.status && row.status.toLowerCase().includes(searchText))
  )

  const handleCreateOrUpdateLead = async () => {
    try {
      let response
      const dataToSend = { ...formData }

      if (isEditing && currentLeadId) {
        response = await api.put(`/leads/${currentLeadId}`, dataToSend)
        console.log(`Updating lead ${currentLeadId}:`, response)
        setAlertMessage('Lead updated successfully!')
      } else {
        response = await api.post('/leads', dataToSend)
        console.log('Creating new lead:', response)
        setAlertMessage('Lead added successfully!')
      }

      setAlertSeverity('success')
      fetchLeads()
      setOpenDialog(false)
      setIsEditing(false)
      setCurrentLeadId(null) // Reset currentLeadId after operation
    } catch (error) {
      setAlertMessage('Failed to add/update lead')
      setAlertSeverity('error')
      console.error('Error adding/updating lead:', error)
    }
    setAlertOpen(true)
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

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleFollowUpDateChange = date => {
    setFormData(prevData => ({
      ...prevData,
      follow_up: date, // Store the Date object directly
    }))
  }

  const handleOpenDialog = () => {
    setIsEditing(false)
    setCurrentLeadId(null)
    setFormData({
      lead_name: '',
      lead_type: '',
      company_name: '',
      email: '',
      phone_number: '',
      status: '',
    })
    setOpenDialog(true)
  }

  const handleAddFollowUp = async leadId => {
    if (!newFollowUpRemarks || !newNextFollowUpDate) {
      setAlertMessage('Please fill in both remarks and follow-up date')
      setAlertSeverity('error')
      setAlertOpen(true)
      return
    }

    const newFollowUp = {
      lead_id: leadId,
      date: new Date().toISOString(),
      next_followup_date:
        newNextFollowUpDate instanceof Date ? newNextFollowUpDate.toISOString() : null,
      remarks: newFollowUpRemarks,
    }

    try {
      // Make API call to add follow-up
      const response = await api.post('/followup-history', newFollowUp)
      setRows(prevRows => {
        const updatedRows = prevRows.map(row =>
          row.id === leadId
            ? {
                ...row,
                history: [
                  ...row.history,
                  {
                    date: new Date(response.data.date),
                    nextFollowUpDate: new Date(response.data.next_followup_date),
                    remarks: response.data.remarks,
                  },
                ],
              }
            : row
        )
        console.log(
          'Updated row:',
          updatedRows.find(row => row.id === leadId)
        )
        return updatedRows
      })

      setNewFollowUpRemarks('')
      setNewNextFollowUpDate(null)

      setAlertMessage('Follow-up added successfully!')
      setAlertSeverity('success')
    } catch (error) {
      console.error('Error adding follow-up:', error)
      setAlertMessage('Failed to add follow-up')
      setAlertSeverity('error')
    }

    setAlertOpen(true)
  }
  return (
    <Container>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={1}>
        <Typography
          variant='h4'
          component='h2'
          gutterBottom
          style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        >
          <SvgColor
            src={`/assets/icons/navbar/ic_lead.svg`}
            sx={{ width: 50, height: 30, marginRight: 2 }}
          />
          Leads
        </Typography>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          style={{ marginLeft: 'auto' }}
        >
          Add Lead
        </Button>
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <OutlinedInput
          // sx={{ marginBottom: 1.5 }}
          onChange={handleSearch}
          value={searchText}
          placeholder='Search Leads...'
          startAdornment={
            <InputAdornment position='start'>
              <Iconify
                icon='eva:search-fill'
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
        <Box sx={{ position: 'relative' }}>
          <IconButton onClick={handleToggle} sx={{ display: 'flex', alignItems: 'center' }}>
            <ArrowDropDownIcon />
            <Label variant='h2'>Customize View..</Label>
          </IconButton>
          {open && (
            <Fade in={open} timeout={300}>
              <Box
                position='absolute'
                top={10}
                right={140}
                bgcolor='background.paper'
                boxShadow={5}
                borderRadius={1}
                zIndex={7}
                ref={menuRef}
                minWidth='172px' // Ensure a minimum width
                sx={{
                  overflowY: 'auto', // Enable vertical scrolling
                  maxHeight: 'calc(100vh - 100px)', // Adjust this value to fit within the screen height
                  // transition: '3s ease-in-out',
                }}
              >
                {columns(handleEditClick, handleDeleteClick).map(col => (
                  <Box
                    key={col.field}
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    pb={0.1}
                    pl={1}
                  >
                    <label>
                      <Checkbox
                        checked={visibleColumns.includes(col.field)}
                        onChange={() => handleColumnToggle(col.field)}
                        size='small' // Use small size for consistency
                        sx={{ mx: 0 }}
                      />
                      <Label>{col.headerName}</Label>
                    </label>
                  </Box>
                ))}
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                  <Button onClick={handleShowHideAll} size='small' sx={{ minWidth: '45%' }}>
                    Show/Hide
                  </Button>
                  <Button onClick={handleReset} size='small' sx={{ minWidth: '45%' }}>
                    Reset
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}
        </Box>
      </div>
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
      {filteredRows.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <Typography variant='body1' style={{ marginTop: '10px' }}>
              No leads found.
            </Typography>
          </div>
        </div>
      ) : (
        <Paper sx={{ maxHeight: 330, minWidth: 500, overflow: 'hidden' }}>
          <TableContainer component={Paper} sx={{ maxHeight: 330 }}>
            <Table
              stickyHeader
              sx={{ maxHeight: 300, minWidth: 500 }}
              size='small'
              aria-label='a dense table'
            >
              <TableHead>
                <TableRow>
                  <TableCell>Lead Name</TableCell>
                  <TableCell>Lead Type</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Lead Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              {/* <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(lead => (
                    <React.Fragment key={lead.id}>
                      <TableRow
                        onClick={() => handleRowClick(lead.id)}
                        style={{ cursor: 'pointer' }}
                        hover // Adds hover effect
                      >
                        <TableCell>{lead.lead_name}</TableCell>
                        <TableCell>{lead.lead_type}</TableCell>
                        <TableCell>{lead.company_name}</TableCell>
                        <TableCell>{new Date(lead.lead_date).toLocaleDateString()}</TableCell>
                        <TableCell>{lead.status}</TableCell>
                        <TableCell>
                          <IconButton
                            aria-label='expand'
                            onClick={event => {
                              event.stopPropagation()
                              handleChange(lead.id)(null, expanded !== lead.id)
                            }}
                            size='small'
                            style={{ marginRight: 5 }}
                          >
                            <ExpandMore
                              style={{
                                transform: expanded === lead.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              }}
                            />
                          </IconButton>
                          <IconButton
                            aria-label='edit'
                            onClick={event => {
                              event.stopPropagation()
                              handleEditClick(lead.id)
                            }}
                            size='small'
                            style={{ marginRight: 5 }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={event => {
                              event.stopPropagation()
                              handleDeleteClick(lead.id)
                            }}
                            size='small'
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      {expanded === lead.id && (
                        <TableRow>
                          <TableCell colSpan={6} style={{ padding: 0 }}>
                            <Accordion expanded={true}>
                              <AccordionDetails
                                style={{ background: '#f5f5f5', padding: '8px 16px' }}
                              >
                                <Box width='100%'>
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                  >
                                    <Typography
                                      variant='subtitle1'
                                      gutterBottom
                                      sx={{ color: '#58C29F' }}
                                    >
                                      Follow-up History
                                    </Typography>
                                    <IconButton
                                      aria-label='expand'
                                      size='small'
                                      onClick={event => {
                                        event.stopPropagation()
                                        handleChange(lead.id)(null, expanded !== lead.id)
                                      }}
                                    >
                                      <ExpandMore
                                        style={{
                                          transform:
                                            expanded === lead.id
                                              ? 'rotate(180deg)'
                                              : 'rotate(0deg)',
                                        }}
                                      />
                                    </IconButton>
                                  </Box>

                                  <Table size='small' stickyHeader>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Follow-Up Date</TableCell>
                                        <TableCell>Next Follow-Up Date</TableCell>
                                        <TableCell>Remarks</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {lead.history.length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={3} align='center'>
                                            <Typography variant='subtitle2' color='textSecondary'>
                                              No Follow-up History Found
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        lead.history.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>
                                              {new Date(item.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                              {new Date(item.nextFollowUpDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{item.remarks}</TableCell>
                                          </TableRow>
                                        ))
                                      )}
                                    </TableBody>
                                  </Table>

                                  <Box mt={1}>
                                    <Box mb={1}>
                                      <Typography
                                        variant='subtitl2'
                                        gutterBottom
                                        sx={{
                                          fontWeight: '600',
                                          color: '#58C29F',
                                          marginBottom: '10px',
                                        }}
                                      >
                                        Capture Follow-up Record
                                      </Typography>
                                    </Box>
                                    <Box
                                      display='flex'
                                      alignItems='center'
                                      justifyContent='space-between'
                                      width='100%'
                                    >
                                      <TextField
                                        label='Remarks'
                                        variant='outlined'
                                        size='small'
                                        value={newFollowUpRemarks}
                                        onChange={e => setNewFollowUpRemarks(e.target.value)}
                                        sx={{ width: 'calc(40% - 8px)', marginRight: 1 }}
                                      />
                                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                          label='Follow-Up Date'
                                          value={newNextFollowUpDate}
                                          onChange={date => {
                                            const utcDate = new Date(
                                              Date.UTC(
                                                date.getFullYear(),
                                                date.getMonth(),
                                                date.getDate()
                                              )
                                            )
                                            setNewNextFollowUpDate(utcDate)
                                          }}
                                          defaultValue={dayjs('2022-04-17')}
                                          variant='outlined'
                                          sx={{
                                            width: 'calc(40% - 8px)',
                                            marginRight: 1,
                                            '& .MuiInputBase-root': {
                                              height: '40px', // Adjust this value to match your TextField height
                                            },
                                          }}
                                        />
                                      </LocalizationProvider>
                                      <Button
                                        variant='contained'
                                        color='inherit'
                                        size='small'
                                        startIcon={<AddIcon />}
                                        onClick={() => handleAddFollowUp(lead.id)}
                                        sx={{ width: 'calc(20% - 8px)', height: '40px' }} // Set a fixed height to match other elements
                                      >
                                        Add
                                      </Button>
                                    </Box>
                                  </Box>
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
              </TableBody> */}
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(lead => (
                    <React.Fragment key={lead.id}>
                      {/* Main row for each lead */}
                      <TableRow
                        onClick={() => handleRowClick(lead.id)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        }}
                      >
                        <TableCell>{lead.lead_name}</TableCell>
                        <TableCell>{lead.lead_type}</TableCell>
                        <TableCell>{lead.company_name}</TableCell>
                        <TableCell>{new Date(lead.lead_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={lead.status}
                            color={getStatusColor(lead.status)}
                            size='small'
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={event => {
                              event.stopPropagation()
                              handleChange(lead.id)(null, expanded !== lead.id)
                            }}
                            size='small'
                          >
                            <ExpandMore
                              sx={{
                                transform: expanded === lead.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                              }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={event => {
                              event.stopPropagation()
                              handleEditClick(lead.id)
                            }}
                            size='small'
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={event => {
                              event.stopPropagation()
                              handleDeleteClick(lead.id)
                            }}
                            size='small'
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      {/* Expanded row with follow-up history */}
                      {expanded === lead.id && (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ padding: 0 }}>
                            <Box
                              sx={{
                                backgroundColor: 'background.paper',
                                padding: 2,
                                borderRadius: 1,
                              }}
                            >
                              <Typography
                                variant='h6'
                                gutterBottom
                                color='primary'
                                sx={{ fontWeight: 'bold' }}
                              >
                                Follow-up History
                              </Typography>

                              {lead.history.length === 0 ? (
                                <Typography
                                  variant='body2'
                                  color='text.secondary'
                                  sx={{ fontStyle: 'italic', textAlign: 'center', my: 2 }}
                                >
                                  No Follow-up History Found
                                </Typography>
                              ) : (
                                <TableContainer
                                  component={Paper}
                                  elevation={0}
                                  sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}
                                >
                                  <Table size='small' stickyHeader>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                          Follow-Up Date
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                          Next Follow-Up Date
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {lead.history.map((item, index) => (
                                        <TableRow key={index}>
                                          <TableCell>
                                            {new Date(item.date).toLocaleDateString()}
                                          </TableCell>
                                          <TableCell>
                                            {new Date(item.nextFollowUpDate).toLocaleDateString()}
                                          </TableCell>
                                          <TableCell>{item.remarks}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              )}

                              <Typography
                                variant='h6'
                                gutterBottom
                                color='primary'
                                sx={{ fontWeight: 'bold' }}
                              >
                                Add New Follow-up
                              </Typography>
                              <Grid container spacing={2} alignItems='center'>
                                <Grid item xs={12} sm={5}>
                                  <TextField
                                    fullWidth
                                    label='Remarks'
                                    variant='outlined'
                                    size='small'
                                    value={newFollowUpRemarks}
                                    onChange={e => setNewFollowUpRemarks(e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={8} sm={5}>
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                          label='Follow-Up Date'
                                          value={newNextFollowUpDate}
                                          onChange={date => {
                                            const utcDate = new Date(
                                              Date.UTC(
                                                date.getFullYear(),
                                                date.getMonth(),
                                                date.getDate()
                                              )
                                            )
                                            setNewNextFollowUpDate(utcDate)
                                          }}
                                          defaultValue={dayjs('2022-04-17')}
                                          variant='outlined'
                                          sx={{
                                            // width: 'calc(40% - 8px)',
                                            // marginRight: 1,
                                            '& .MuiInputBase-root': {
                                              height: '40px', // Adjust this value to match your TextField height
                                            },
                                          }}
                                        />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <Button
                                    fullWidth
                                    variant='contained'
                                    color='primary'
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddFollowUp(lead.id)}
                                  >
                                    Add
                                  </Button>
                                </Grid>
                              </Grid>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        <Box display='flex' alignItems='center' ml={3}>
          <Typography variant='subtitle4' actionPosition='right' color='textSecondary'>
            If the customer is not listed here? please
          </Typography>
          <Button
            component={RouterLink}
            to='/customer'
            color='primary'
            size='small'
            sx={{ marginLeft: 0.2, textTransform: 'none', marginTop: 0.2 }}
          >
            Add New Customer
          </Button>
        </Box>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Select Customer Names'
                name='lead_name'
                value={formData.lead_name}
                onChange={handleLeadNameChange}
                select
                variant='outlined'
                required
                error={!formData.lead_name}
                helperText={!formData.lead_name ? 'Lead Name is required' : ''}
                sx={{ marginBottom: 2, top: 5 }}
              >
                {leads.map(lead => (
                  <MenuItem key={lead.id} value={lead.full_name}>
                    {lead.full_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Select Lead Type'
                name='lead_type'
                value={formData.lead_type}
                onChange={handleInputChange}
                select
                variant='outlined'
                required
                error={!formData.lead_type}
                helperText={!formData.lead_type ? 'Lead Type is required' : ''}
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value='Instagram'>Instagram</MenuItem>
                <MenuItem value='Facebook'>Facebook</MenuItem>
                <MenuItem value='Twitter'>Twitter</MenuItem>
                <MenuItem value='LinkedIn'>LinkedIn</MenuItem>
                <MenuItem value='Newspaper'>Newspaper</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Company Name'
                name='company_name'
                value={formData.company_name}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.company_name}
                helperText={!formData.company_name ? 'Company Name is required' : ''}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)}
                helperText={
                  !formData.email
                    ? 'Email is required'
                    : !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
                    ? 'Invalid Email Address'
                    : ''
                }
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Phone Number'
                name='phone_number'
                value={formData.phone_number}
                onChange={handleInputChange}
                variant='outlined'
                required
                error={!formData.phone_number || !/^\d{10}$/.test(formData.phone_number)}
                helperText={
                  !formData.phone_number
                    ? 'Phone Number is required'
                    : !/^\d{10}$/.test(formData.phone_number)
                    ? 'Invalid Phone Number'
                    : ''
                }
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Select Lead Status'
                name='status'
                value={formData.status}
                onChange={handleInputChange}
                select
                variant='outlined'
                required
                error={!formData.status}
                helperText={!formData.status ? 'Status is required' : ''}
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value='draft'>Draft</MenuItem>
                <MenuItem value='new'>New</MenuItem>
                <MenuItem value='in negociation'>In Negotiation</MenuItem>
                <MenuItem value='won'>Won</MenuItem>
                <MenuItem value='loose'>Loose</MenuItem>
                <MenuItem value='canceled'>Canceled</MenuItem>
                <MenuItem value='on hold'>On Hold</MenuItem>
                <MenuItem value='waiting'>Waiting</MenuItem>
              </TextField>
            </Grid>

            {/* <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Follow Up Date'
                  value={formData.follow_up}
                  onChange={handleFollowUpDateChange}
                  renderInput={props => <TextField {...props} variant='outlined' fullWidth />}
                  required
                  error={!formData.follow_up}
                  helperText={!formData.follow_up ? 'Follow Up Date is required' : ''}
                  sx={{ marginBottom: 2 }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Follow Up Remarks'
                name='followup_description'
                value={formData.followup_description}
                onChange={handleInputChange}
                variant='outlined'
                multiline
                rows={4}
                required
                error={!formData.followup_description}
                helperText={
                  !formData.followup_description ? 'Follow Up Description is required' : ''
                }
                sx={{ marginBottom: 2 }}
              />
            </Grid> */}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateOrUpdateLead}
            color='primary'
            variant='contained'
            disabled={!isLeadFormValid()}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Are you sure you want to delete this lead?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='primary' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={handleAlertClose}
          severity={alertSeverity}
        >
          <AlertTitle>{alertSeverity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

export default LeadSourcePage


// bhai dekh code kitnaaaa lmba bana is table ka