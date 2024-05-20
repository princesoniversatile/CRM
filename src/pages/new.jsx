import { Helmet } from 'react-helmet-async';

import CreateUser from 'src/ourComponents/Profile/new';

// ----------------------------------------------------------------------

export default function NewUserPage() {
  return (
    <>
      <Helmet>
        <title> User | Versatile </title>
      </Helmet>

      <CreateUser />
    </>
  );
}
