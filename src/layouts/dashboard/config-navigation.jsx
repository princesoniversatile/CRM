import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);


const navConfig = [
  {
    title: 'Pre Sales',
    icon: icon('ic_pre_sales'),
    subMenus: [
      {
        title: 'Customers',
        path: '/customer',
        icon: icon('ic_user'),
      },
      {
        title: 'Products Category',
        path: '/product-category',
        icon: icon('ic_pro_cat'),
      },
      {
        title: 'Products',
        path: '/products',
        icon: icon('ic_cart'),
      },
      {
        title: 'Leads',
        path: '/leads',
        icon: icon('ic_lead'),
      },
      {
        title: 'Lead Source',
        path: '/leads-source',
        icon: icon('ic_lead_source'),
      },
      {
        title: 'Offers',
        path: '/offers',
        icon: icon('ic_offer'),
      },
      {
        title: 'Birthday Reminders',
        path: '/birthday-reminders',
        icon: icon('ic_cakes'),
      },
      {
        title: 'Reports',
        path: '/reports',
        icon: icon('ic_report'),
      },
    ],
  },
  {
    title: 'Post Sales',
    path: '',
    icon: icon('ic_post_sales'),
    subMenus: [
      {
        title: 'Complaints',
        path: '/complaints',
        icon: icon('ic_complaint'),
      },
      {
        title: 'Resolutions',
        path: '/resolution',
        icon: icon('ic_resolution'),
      },
    ],
  },
  {
    title: 'Lead Capture',
    path: '',
    icon: icon('ic_lead_capture'),
    subMenus: [
      {
        title: 'Scrapper Tool',
        path: '/scrapper',
        icon: icon('ic_scrapper'),
      },
    ],
  },
];

// Check if user is admin and add Admin Management section
const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
if (userDetails.role === 'Admin') {
  navConfig.push({
    title: 'Admin Management',
    path: '',
    icon: icon('ic_admin'),
    subMenus: [
      {
        title: 'Admin Manager',
        path: '/admin',
        icon: icon('ic_admin'),
      },
    ],
  });
}


export default navConfig;
