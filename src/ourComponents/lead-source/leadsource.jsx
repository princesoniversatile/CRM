import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Toolbar,
  Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SvgColor from 'src/components/svg-color';

const LeadSourcePage = () => {
  const [leadTypes, setLeadTypes] = useState([]);
  const [reportType, setReportType] = useState('');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [labelShrink, setLabelShrink] = useState(true);

  const api = import.meta.env.VITE_API;

  useEffect(() => {
    // Fetch leads data from the API
    fetch(`${api}/leads`)
      .then(response => response.json())
      .then(data => {
        setLeads(data);
        const uniqueLeadTypes = [...new Set(data.map(lead => lead.lead_type))];
        setLeadTypes(uniqueLeadTypes);
        if (uniqueLeadTypes.length > 0) {
          setReportType(uniqueLeadTypes[0]);
          const filtered = data.filter(lead => lead.lead_type === uniqueLeadTypes[0]);
          setFilteredLeads(filtered);
        }
      })
      .catch(error => console.error('Error fetching leads:', error));
  }, []);

  const handleChange = event => {
    const selectedLeadType = event.target.value;
    setReportType(selectedLeadType);
    const filtered = leads.filter(lead => lead.lead_type === selectedLeadType);
    setFilteredLeads(filtered);
    // Update label shrink state based on selected lead type
    setLabelShrink(selectedLeadType !== '');
  };

  const handleFocus = () => {
    setLabelShrink(true);
  };

  const handleBlur = () => {
    if (!reportType) {
      setLabelShrink(false);
    }
  };

  const columns = [
    { field: 'lead_name', headerName: 'Lead Name', width: 130 },
    { field: 'company_name', headerName: 'Company Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone_number', headerName: 'Phone Number', width: 150 },
    {
      field: 'follow_up',
      headerName: 'Follow Up Date',
      width: 150,
    },
    { field: 'followup_description', headerName: 'Follow Up Description', width: 200 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Toolbar>
        <Typography variant='h4' gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
          <SvgColor
            src={`/assets/icons/navbar/ic_lead_source.svg`}
            sx={{ width: 50, height: 30, marginRight: 2 }}
          />
          Choose Your Lead Source
        </Typography>
      </Toolbar>
      <FormControl fullWidth>
        <InputLabel id='report-type-label'  shrink={labelShrink}>
          Select Lead Type
        </InputLabel>
        <Select
          labelId='report-type-label'
          label='Select Lead Type'
          value={reportType}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          sx={{ marginBottom: '20px' }}
        >
          {leadTypes.map((type, index) => (
            <MenuItem key={index} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box height={260} width='100%'>
        <DataGrid rows={filteredLeads} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
      </Box>
    </div>
  );
};

export default LeadSourcePage;
