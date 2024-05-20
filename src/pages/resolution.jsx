import { Helmet } from 'react-helmet-async';

import ResolutionsTable from 'src/ourComponents/resolutions/resolutionTable';

// import ResolutionsForm from 'src/ourComponents/resolutions/resolutions';

// ----------------------------------------------------------------------

export default function ResolutionPage() {
  return (
    <>
      <Helmet>
        <title> Resolution | Versatile </title>
      </Helmet>

      {/* <ResolutionsForm/> */}
      <ResolutionsTable/>
    </>
  );
}
