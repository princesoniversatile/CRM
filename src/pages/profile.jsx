import { Helmet } from 'react-helmet-async';

import ProfilePage from 'src/ourComponents/Profile/profile';

// ----------------------------------------------------------------------

export default function Profile() {
  return (
    <>
      <Helmet>
        <title> Profile | Versatile </title>
      </Helmet>

      <ProfilePage />
    </>
  );
}
