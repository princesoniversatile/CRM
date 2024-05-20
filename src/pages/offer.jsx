import { Helmet } from 'react-helmet-async'

import OfferForm from 'src/ourComponents/Offer/offer'

// import { LoginView } from 'src/sections/login'
// import Typography from '@mui/material/Typography'

// ----------------------------------------------------------------------

export default function OfferPage () {
  return (
    <>
      <Helmet>
        <title> Offer | Versatile </title>
      </Helmet>

    
      <OfferForm/>
    </>
  )
}
