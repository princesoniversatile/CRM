import { Helmet } from 'react-helmet-async';

import ReportPage from 'src/ourComponents/Reports/reportPage';

// ----------------------------------------------------------------------

export default function Profile() {
  return (
    <>
      <Helmet>
        <title> Reports | Versatile </title>
      </Helmet>

      <ReportPage />
    </>
  );
}
