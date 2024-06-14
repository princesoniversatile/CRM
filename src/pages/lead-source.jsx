import { Helmet } from 'react-helmet-async';

import LeadSourcePage from 'src/ourComponents/lead-source/leadsource';


// ----------------------------------------------------------------------

export default function ComplaintsPage() {
  return (
    <>
      <Helmet>
        <title> Lead Source | Versatile </title>
      </Helmet>

      <LeadSourcePage/>
    </>
  );
}
