import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

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
export const ProductCategoryPage  = lazy(() => import('src/pages/products-category'));
export const NewUserPage = lazy(() => import('src/pages/new'));
export const OfferPage = lazy(() => import('src/pages/offer'));
export const ComplaintsPage = lazy(() => import('src/pages/complaints'));
export const ResolutionPage = lazy(() => import('src/pages/resolution'));
export const ScrapperPage = lazy(() => import('src/pages/scrapper'));
export const BirthdayReminderPage = lazy(() => import('src/pages/birthday-reminders'));
export const ReportsPage = lazy(() => import('src/pages/reports'));


export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';

  const routes = useRoutes([
    {
      element: loggedIn ? (
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
      ],
    },

    // {
    //   path: 'login',
    //   element: <LoginPage />,
    // },
    {
      path: 'login',
      element: loggedIn ? <Navigate to="/" replace /> : <LoginPage />,
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

  return routes;
}
