import { Helmet } from 'react-helmet-async';

import HeaderFilteringDataGridPro from 'src/ourComponents/Birthday-Reminders/birthdayTable';

// import BirthdayReminders from 'src/ourComponents/Birthday-Reminders/birthdayreminders';
// import ProductList from 'src/ourComponents/product/product-list';

// ----------------------------------------------------------------------

export default function BirthdayReminderPage() {
  return (
    <>
      <Helmet>
        <title> Birthday Reminders | Versatile </title>
      </Helmet>

      <HeaderFilteringDataGridPro/>
      {/* <BirthdayReminders /> */}
    </>
  );
}
