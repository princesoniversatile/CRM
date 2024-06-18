import { Helmet } from 'react-helmet-async';

import LeadHistoryPage from 'src/ourComponents/lead-history/leadhistory';


// ----------------------------------------------------------------------

export default function leadHistoryPage() {
  return (
    <>
      <Helmet>
        <title> Lead History | Versatile </title>
      </Helmet>

      <LeadHistoryPage/>
    </>
  );
}
