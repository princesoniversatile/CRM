import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Typography, CardMedia, Toolbar } from '@mui/material';
import CustomerReport from './innerReport/customerReport';
import ResolutionReport from './innerReport/resolutionReport';
import ComplaintReport from './innerReport/ComplaintReport';
import BirthdayReports from './innerReport/BirthdayReports';
import LeadsReport from './innerReport/leadsReport';
import OfferReports from './innerReport/offerReports';
import { Box } from '@mui/system';
import SvgColor from 'src/components/svg-color';

const ReportPage = () => {
  const [reportType, setReportType] = useState('');
  const [labelShrink, setLabelShrink] = useState(false);

  const handleChange = (event) => {
    setReportType(event.target.value);
  };

  const handleFocus = () => {
    setLabelShrink(true);
  };

  const handleBlur = () => {
    if (!reportType) {
      setLabelShrink(false);
    }
  };

  const renderReportComponent = () => {
    switch (reportType) {
      case 'complaint':
        return <ComplaintReport />;
      case 'resolution':
        return <ResolutionReport />;
      case 'offer':
        return <OfferReports />;
      case 'customer':
        return <CustomerReport />;
      case 'leads':
        return <LeadsReport />;
      case 'birthday':
        return <BirthdayReports />;
      default:
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="60%"
            width="100%"
          >
            <CardMedia
              component="img"
              image="assets/Reportboard.png"
              alt="Reportboard"
              sx={{ width: '50%', height: '100%' }}
            />
          </Box>
        );
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      
      <Toolbar>
  <Typography variant='h4' gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
    <SvgColor
      src={`/assets/icons/navbar/ic_report.svg`}
      sx={{ width: 50, height: 30, marginRight: 2 }}
    />
    Report Section
  </Typography>
</Toolbar>


      <FormControl fullWidth>
        <InputLabel id='report-type-label' sx={{ top: '9px' }} shrink={labelShrink}>
          Select Report Type
        </InputLabel>
        <Select
          labelId='report-type-label'
          value={reportType}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          sx={{ marginBottom: '20px' }}
        >
          <MenuItem value='customer'>Customer Report</MenuItem>
          <MenuItem value='resolution'>Resolution Report</MenuItem>
          <MenuItem value='complaint'>Complaint Report</MenuItem>
          <MenuItem value='birthday'>Birthday Report</MenuItem>
          <MenuItem value='offer'>Offer Report</MenuItem>
          <MenuItem value='leads'>Leads Report</MenuItem>
        </Select>
      </FormControl>
      {renderReportComponent()}
    </div>
  );
};

export default ReportPage;
