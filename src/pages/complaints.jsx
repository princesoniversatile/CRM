import { Helmet } from 'react-helmet-async';

// import Typography from '@mui/material/Typography'
// import PostSalesComplaintsForm from 'src/ourComponents/complaints/complaints';
import FullFeaturedCrudGrid from 'src/ourComponents/complaints/complaintsTable';

// import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function ComplaintsPage() {
  return (
    <>
      <Helmet>
        <title> Blog | Versatile </title>
      </Helmet>

      {/* <BlogView /> */}
      {/* <Typography variant="body1" color="initial">Complaints</Typography> */}
      {/* <PostSalesComplaintsForm/> */}
      <FullFeaturedCrudGrid/>
    </>
  );
}
