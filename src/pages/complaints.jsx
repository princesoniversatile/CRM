import { Helmet } from 'react-helmet-async';

import FullFeaturedCrudGrid from 'src/ourComponents/complaints/complaintsTable';


// ----------------------------------------------------------------------

export default function ComplaintsPage() {
  return (
    <>
      <Helmet>
        <title> Blog | Versatile </title>
      </Helmet>


      <FullFeaturedCrudGrid/>
    </>
  );
}
