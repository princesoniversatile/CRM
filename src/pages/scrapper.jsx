import { Helmet } from 'react-helmet-async';

// import Typography from '@mui/material/Typography'

import SearchBar from 'src/ourComponents/scrapper/scrapper';

// ----------------------------------------------------------------------

export default function ScrapperPage() {
  return (
    <>
      <Helmet>
        <title> Scrapper | Versatile </title>
      </Helmet>

      {/* <Typography variant="body1" color="initial">Scrapper Page</Typography> */}
      <SearchBar/>
    </>
  );
}
