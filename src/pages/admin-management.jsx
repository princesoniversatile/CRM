import { Helmet } from 'react-helmet-async';

import AdminTable from 'src/ourComponents/Admin-Manager/admin';


// import { LoginView } from 'src/sections/login';
// import { WelcomeView } from 'src/sections/welcome/view';


// ----------------------------------------------------------------------

export default function AdminManagementPage() {
  return (
    <>
      <Helmet>
        <title> Admin-Section | Versatile </title>
      </Helmet>

      <AdminTable />
    </>
  );
}
