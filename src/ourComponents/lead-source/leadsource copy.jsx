import React, { useEffect, useState, useRef } from 'react'
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
      // formData.follow_up &&
      // formData.followup_description
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
    status: ''

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
      status:''
    })
  }

  const handleToggle = () => {
    setOpen(!open) // Toggle the open state
  }

  const fetchLeads = async () => {
    try {
      const response = await api.get(`/leads`)
      const fetchedData = response.data.map(item => ({
        id: item.id,
        lead_name: item.lead_name,
        lead_date: item.lead_date,
        lead_type: item.lead_type,

        company_name: item.company_name,
        follow_up: new Date(item.follow_up),
        email: item.email,
        status: item.status,
        phone_number: item.phone_number,
        followup_description: item.followup_description,
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

  const handleDeleteClick = id => {
    setCurrentLeadId(id)
    setConfirmDeleteOpen(true)
  }

  const handleCreateOrUpdateLead = async () => {
    try {
      let response
      let response1
      const dataToSend = { ...formData }

      // Convert follow_up date to ISO string format if it's a Date object
      if (formData.follow_up instanceof Date) {
        dataToSend.follow_up = formData.follow_up.toISOString().split('T')[0]
      } else {
        delete dataToSend.follow_up // Remove follow_up if it's null or not a Date object
      }

      if (isEditing) {
        response = await api.put(`/leads/${currentLeadId}`, dataToSend)
        response1 = await api.post('/lead-history', { ...dataToSend })
        console.log(response1)
        setAlertMessage('Lead updated successfully!')
      } else {
        response = await api.post('/leads', dataToSend)
        response1 = await api.post('/lead-history', { ...dataToSend, lead_date: new Date() })
        console.log(response1)
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

  // const handleOpenDialog = () => {
  //   setNewFollowUpRemarks('')
  //   setNewNextFollowUpDate(null)
  // }

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

  const handleAddFollowUp = leadId => {
    const newFollowUp = {
      date: new Date().toISOString(),
      nextFollowUpDate: newNextFollowUpDate.toISOString(),
      remarks: newFollowUpRemarks,
    }
    const lead = leadsData.find(lead => lead.id === leadId)
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
      <TableContainer component={Paper}>
        <Table>
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
          <TableBody>
            {leadsData.map(lead => (
              <React.Fragment key={lead.id}>
                <TableRow onClick={() => handleRowClick(lead.id)} style={{ cursor: 'pointer' }}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.type}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{format(lead.LeadDate, 'yyyy-MM-dd')}</TableCell>
                  {/* <TableCell>{lead.followUpRemarks}</TableCell> */}
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label='expand'
                      onClick={event => {
                        event.stopPropagation()
                        handleChange(lead.id)(null, expanded !== lead.id)
                      }}
                    >
                      <ExpandMore />
                    </IconButton>
                    <IconButton aria-label='edit' onClick={event => event.stopPropagation()}>
                      <Edit />
                    </IconButton>
                    <IconButton aria-label='delete' onClick={event => event.stopPropagation()}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {expanded === lead.id && (
                  <TableRow>
                    <TableCell colSpan={7} style={{ padding: 0 }}>
                      <Accordion expanded={true}>
                        <AccordionDetails>
                          <Box p={2} width='100%'>
                            <Typography variant='subtitle1'>Follow-Up History:</Typography>
                            <Table size='small'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Follow-Up Date</TableCell>
                                  <TableCell>Next Follow-Up Date</TableCell>
                                  <TableCell>Remarks</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {lead.history.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{format(item.date, 'yyyy-MM-dd')}</TableCell>
                                    <TableCell>
                                      {format(item.nextFollowUpDate, 'yyyy-MM-dd')}
                                    </TableCell>
                                    <TableCell>{item.remarks}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <Box mt={2}>
                              <Typography variant='subtitle1'>Add Follow-Up:</Typography>
                              <Box display='flex' alignItems='center' mt={1}>
                                <TextField
                                  label='Remarks'
                                  variant='outlined'
                                  size='small'
                                  fullWidth
                                  value={newFollowUpRemarks}
                                  onChange={e => setNewFollowUpRemarks(e.target.value)}
                                  style={{ marginRight: 10 }}
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    label='Follow-Up Date'
                                    value={newNextFollowUpDate}
                                    onChange={date => setNewNextFollowUpDate(date)}
                                    renderInput={params => (
                                      <TextField
                                        {...params}
                                        variant='outlined'
                                        size='small'
                                        fullWidth
                                      />
                                    )}
                                    style={{ marginRight: 10 }}
                                  />
                                </LocalizationProvider>

                                <Button
                                  variant='contained'
                                  color='primary'
                                  size='small'
                                  startIcon={<AddIcon />}
                                  onClick={() => handleAddFollowUp(lead.id)}
                                  sx={{ marginLeft: 3 }}
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
          </TableBody>
        </Table>
      </TableContainer>

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
