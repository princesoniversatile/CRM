import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Typography, CardMedia, Toolbar } from '@mui/material';
import CustomerReport from './innerReport/customerReport';
import ResolutionReport from './innerReport/resolutionReport';
import ComplaintReport from './innerReport/ComplaintReport';
import BirthdayReports from './innerReport/BirthdayReports';
import LeadsReport from './innerReport/leadsReport';
import OfferReports from './innerReport/offerReports';
import { Box, Container } from '@mui/system';
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
    <Container>
      <Toolbar>
        <Typography variant='h4' gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
          <SvgColor
            src={`/assets/icons/navbar/ic_report.svg`}
            sx={{ width: 50, height: 30, marginRight: 2 }}
          />
          Report Section
        </Typography>
      </Toolbar>

      <FormControl fullWidth margin="dense">
        <InputLabel id='report-type-label' shrink={labelShrink} sx={{top:'9px'}}>
          Select Report Type
        </InputLabel>
        <Select
          labelId='report-type-label'
          value={reportType}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          margin="dense"
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
    </Container>
  );
};

export default ReportPage;
