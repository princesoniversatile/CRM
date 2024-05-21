import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Typography } from '@mui/material';

// import ComplaintsGrid from '../complaints/complaintsTable';
// import ResolutionPage from 'src/pages/resolution';
// import OfferPage from 'src/pages/offer';
// import UserPage from 'src/pages/user';
// import SettingPage from 'src/pages/setting';
// import BirthdayReminderPage from 'src/pages/birthday-reminders';
import CustomerReport from './innerReport/customerReport';
import ResolutionReport from './innerReport/resolutionReport';
import ComplaintReport from './innerReport/ComplaintReport';
import BirthdayReports from './innerReport/BirthdayREports';
import LeadsReport from './innerReport/leadsReport';
import offerReports from './innerReport/offerReports';
import OfferReports from './innerReport/offerReports';

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
        // return <ComplaintsGrid />;
        return <ComplaintReport />;
      case 'resolution':
        // return <ResolutionPage />;
        return <ResolutionReport />;
      case 'offer':
        // return <OfferPage />;
        return <OfferReports />;
      case 'customer':
        // return <UserPage />;
        return <CustomerReport />;
      case 'leads':
        return <LeadsReport />;
      case 'birthday':
        // return <BirthdayReminderPage />;
        return <BirthdayReports />;
      default:
        return <div>Select a report type to view the report.</div>;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px', marginLeft: '10px' }}>
        Report Section
      </Typography>
      <FormControl fullWidth>
        <InputLabel
          id="report-type-label"
          sx={{ top: '9px' }}
          shrink={labelShrink}
        >
          Select Report Type
        </InputLabel>
        <Select
          labelId="report-type-label"
          value={reportType}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          sx={{ marginBottom: '20px' }}
        >
          <MenuItem value="customer">Customer Report</MenuItem>
          <MenuItem value="resolution">Resolution Report</MenuItem>
          <MenuItem value="complaint">Complaint Report</MenuItem>
          <MenuItem value="birthday">Birthday Report</MenuItem>
          <MenuItem value="offer">Offer Report</MenuItem>
          <MenuItem value="leads">Leads Report</MenuItem>
        </Select>
      </FormControl>
      {renderReportComponent()}
    </div>
  );
};

export default ReportPage;
