import { Helmet } from 'react-helmet-async';

import Setting from 'src/ourComponents/setting/setting';

// ----------------------------------------------------------------------

export default function SettingPage() {
  return (
    <>
      <Helmet>
        <title> Setting | Versatile </title>
      </Helmet>

      <Setting />
    </>
  );
}
