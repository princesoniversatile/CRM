import { Helmet } from 'react-helmet-async';

import CustomersTable from 'src/ourComponents/Customers/customer';

// import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User | Versatile </title>
      </Helmet>

      {/* <UserView /> */}
      <CustomersTable />
    </>
  );
}
