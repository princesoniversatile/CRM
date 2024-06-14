import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

// eslint-disable-next-line import/no-unresolved
import { useRouter } from 'src/routes/hooks';

// eslint-disable-next-line import/no-unresolved
import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const WelcomePage = lazy(() => import('src/pages/welcome'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const SettingPage = lazy(() => import('src/pages/setting'));
export const ProductPage = lazy(() => import('src/pages/productlist'));
export const ProductCategoryPage = lazy(() => import('src/pages/products-category'));
export const NewUserPage = lazy(() => import('src/pages/new'));
export const OfferPage = lazy(() => import('src/pages/offer'));
export const ComplaintsPage = lazy(() => import('src/pages/complaints'));
export const ResolutionPage = lazy(() => import('src/pages/resolution'));
export const ScrapperPage = lazy(() => import('src/pages/scrapper'));
export const BirthdayReminderPage = lazy(() => import('src/pages/birthday-reminders'));
export const ReportsPage = lazy(() => import('src/pages/reports'));
export const AdminPage = lazy(() => import('src/pages/admin-management'));
export const LeadSourcePage = lazy(() => import('src/pages/lead-source'));

export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const router = useRouter();
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const token = localStorage.getItem('token');
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
    // window.location.href = '/login'; // Directly change the window location to ensure complete logout
    router.push('/login');
  };

  // Check token expiration
  const isTokenValid = () => {
    if (!token) return false;

    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);

    return tokenData.exp > now;
  };

  const routes = useRoutes([
    {
      element: loggedIn && isTokenValid() ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'customer', element: <UserPage /> },
        { path: 'customer/new', element: <NewUserPage /> },
        { path: 'products', element: <ProductPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'leads', element: <WelcomePage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'complaints', element: <ComplaintsPage /> },
        { path: 'resolution', element: <ResolutionPage /> },
        { path: 'settings', element: <SettingPage /> },
        { path: 'scrapper', element: <ScrapperPage /> },
        { path: 'offers', element: <OfferPage /> },
        { path: 'birthday-reminders', element: <BirthdayReminderPage /> },
        { path: 'product-category', element: <ProductCategoryPage /> },
        { path: 'reports', element: <ReportsPage /> },
        { path: 'leads-source', element: <LeadSourcePage /> },
        userDetails && userDetails.role === 'Admin' ? { path: 'admin', element: <AdminPage /> } : null,
      ].filter(route => route), // Filter out null routes
    },

    {
      path: 'login',
      element: loggedIn && isTokenValid() ? <Navigate to="/" replace /> : <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },

    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  // Automatically log out if token is expired
  if (!isTokenValid()) {
    handleLogout();
  }

  return routes;
}
