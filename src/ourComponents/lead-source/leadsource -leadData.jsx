import React, { useState } from 'react'
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
} from '@mui/material'
import {
  MdExpandMore as ExpandMore,
  MdEdit as Edit,
  MdDelete as Delete,
  MdAdd as Add,
} from 'react-icons/md'
import { Container } from '@mui/system'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { parseISO, format } from 'date-fns'

const leadsData = [
  {
    id: 1,
    name: 'Sunil Reddy',
    type: 'Twitter',
    company: 'NextGen Tech',
    followUpDate: parseISO('2024-06-17'),
    followUpRemarks: 'Conversation added 1',
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
    followUpDate: parseISO('2024-06-05'),
    followUpRemarks: 'graphic designing work',
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
    followUpDate: parseISO('2024-06-21'),
    followUpRemarks: 'Project discussion',
    status: 'Interested',
    history: [],
  },
  {
    id: 4,
    name: 'Riya Sharma',
    type: 'Instagram',
    company: 'Digital Solutions',
    followUpDate: parseISO('2024-06-11'),
    followUpRemarks: 'Requirement gathering',
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
  const [expanded, setExpanded] = useState(false)
  const [newFollowUpRemarks, setNewFollowUpRemarks] = useState('')
  const [newNextFollowUpDate, setNewNextFollowUpDate] = useState(null)

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleRowClick = leadId => {
    setExpanded(expanded === leadId ? false : leadId)
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
      <Typography variant='h5' component='h2' gutterBottom>
        Leads
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lead Name</TableCell>
              <TableCell>Lead Type</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>FollowUp Date</TableCell>
              <TableCell>FollowUp Remarks</TableCell>
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
                  <TableCell>{format(lead.followUpDate, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{lead.followUpRemarks}</TableCell>
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
                                  startIcon={<Add />}
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
    </Container>
  )
}

export default LeadSourcePage
