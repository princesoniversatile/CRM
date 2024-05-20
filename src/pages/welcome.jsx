import { Helmet } from 'react-helmet-async';

// import { LoginView } from 'src/sections/login';
import { WelcomeView } from 'src/sections/welcome/view';


// ----------------------------------------------------------------------

export default function WelcomePage() {
  return (
    <>
      <Helmet>
        <title> Welcome | Versatile </title>
      </Helmet>

      <WelcomeView />
    </>
  );
}
