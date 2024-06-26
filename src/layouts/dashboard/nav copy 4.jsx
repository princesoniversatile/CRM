// import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';

// import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
// import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import { alpha } from '@mui/material/styles';
// import Collapse from '@mui/material/Collapse';
// import Typography from '@mui/material/Typography';
// import ListItemButton from '@mui/material/ListItemButton';

// import { usePathname } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';

// import { useResponsive } from 'src/hooks/use-responsive';

// import Logo from 'src/components/logo';
// import SvgColor from 'src/components/svg-color';
// import Scrollbar from 'src/components/scrollbar';

// import { NAV } from './config-layout';
// // import navConfig from './config-navigation';
// import AppNavigation from './config-navigation';
// console.log(AppNavigation)

// export default function Nav({ openNav, onCloseNav }) {
//   const pathname = usePathname();
//   const upLg = useResponsive('up', 'lg');
//   // const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem('userDetails')) || {});
//   const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  
//   useEffect(() => {
//     if (openNav) {
//       onCloseNav();
//     }
//   }, [pathname, openNav, onCloseNav]);

//   const handleLogout = () => {
//     localStorage.removeItem('loggedIn');
//     localStorage.removeItem('token');
//     localStorage.removeItem('userDetails');
//     window.location.href = '/login'; // Directly change the window location to ensure complete logout
//   };

//   const renderAccount = (
//     <Box
//       sx={{
//         my: 3,
//         mx: 2.5,
//         py: 2,
//         px: 2.5,
//         display: 'flex',
//         borderRadius: 1.5,
//         alignItems: 'center',
//         bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
//       }}
//     >
//       {/* <Avatar src={userDetails.picture || ''} alt={userDetails.first_name} /> */}
//       <Avatar
//           src={userDetails.picture || ''}
//           alt={userDetails.first_name}
//           sx={{
//             width: 36,
//             height: 36,
//             border: (theme) => `solid 3px ${theme.palette.background.default}`,
//             // border: (theme) => `solid 2px ${theme.palette.primary.main}`,
//             bgcolor: '#58C29F'

//           }}
//         >
//           {(!userDetails.picture && userDetails.first_name) ? userDetails.first_name.charAt(0).toUpperCase() : ''}
//         </Avatar>
//       <Box sx={{ ml: 2 }}>
//         <Typography variant="subtitle2">{`${userDetails.first_name } ${ userDetails.last_name}`}</Typography>
//         {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//           {userDetails.role}
//         </Typography> */}
//       </Box>
//     </Box>
//   );

//   const renderMenu = (
//     <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
//       {AppNavigation.map((item) =>
//         item.title !== 'Logout' && <NavItem key={item.title} item={item} />
//       )}

//       <ListItemButton
//         component={RouterLink}
//         onClick={handleLogout}
//         sx={{
//           minHeight: 44,
//           borderRadius: 0.75,
//           typography: 'body2',
//           color: 'text.secondary',
//           textTransform: 'capitalize',
//           fontWeight: 'fontWeightMedium',
//           '&:hover': {
//             bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
//           },
//         }}
//       >
//         <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
//           <SvgColor src="/assets/icons/navbar/ic_logout.svg" sx={{ width: 24, height: 24 }} />
//         </Box>
//         <Box component="span">Logout</Box>
//       </ListItemButton>
//     </Stack>
//   );

//   const renderUpgrade = (
//     <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
//       <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
//         <Box
//           component="img"
//           src="/assets/illustrations/illustration_avatar.png"
//           sx={{ width: 100, position: 'absolute', top: -50 }}
//         />
//         <Button href="https://versatileitsolution.com" target="_blank" variant="contained" color="inherit">
//           Contact Us
//         </Button>
//       </Stack>
//     </Box>
//   );

//   const renderContent = (
//     <Scrollbar
//       sx={{
//         height: 1,
//         '& .simplebar-content': {
//           height: 1,
//           display: 'flex',
//           flexDirection: 'column',
//         },
//       }}
//     >
//       <Logo sx={{ mt: 3, ml: 4 }} />
//       {renderAccount}
//       {renderMenu}
//       <Box sx={{ flexGrow: 1 }} />
//       {renderUpgrade}
//     </Scrollbar>
//   );

//   return (
//     <Box
//       sx={{
//         flexShrink: { lg: 0 },
//         width: { lg: NAV.WIDTH },
//       }}
//     >
//       {upLg ? (
//         <Box
//           sx={{
//             height: 1,
//             position: 'fixed',
//             width: NAV.WIDTH,
//             borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
//           }}
//         >
//           {renderContent}
//         </Box>
//       ) : (
//         <Drawer
//           open={openNav}
//           onClose={onCloseNav}
//           PaperProps={{
//             sx: {
//               width: NAV.WIDTH,
//             },
//           }}
//         >
//           {renderContent}
//         </Drawer>
//       )}
//     </Box>
//   );
// }

// Nav.propTypes = {
//   openNav: PropTypes.bool,
//   onCloseNav: PropTypes.func,
// };

// function NavItem({ item }) {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   const active = item.path === pathname;

//   const handleToggle = () => {
//     if (item.title !== 'Logout' && item.subMenus) {
//       setOpen(!open);
//     }
//   };

//   const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 24, height: 24 }} />;

//   return (
//     <>
//       <ListItemButton
//         component={RouterLink}
//         href={item.path}
//         sx={{
//           minHeight: 44,
//           borderRadius: 0.75,
//           typography: 'body2',
//           color: 'text.secondary',
//           textTransform: 'capitalize',
//           fontWeight: 'fontWeightMedium',
//           ...(active && {
//             color: 'primary.main',
//             fontWeight: 'fontWeightSemiBold',
//             bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
//             '&:hover': {
//               bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
//             },
//           }),
//         }}
//         onClick={item.subMenus ? handleToggle : undefined}
//       >
//         <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
//           {item.icon ? item.icon : icon(item.iconName)}
//         </Box>
//         <Box component="span">{item.title}</Box>
//       </ListItemButton>

//       {item.subMenus && (
//         <Collapse in={open} timeout="auto" unmountOnExit>
//           <Stack component="nav" spacing={0.5} sx={{ px: 2, ml: 2 }}>
//             {item.subMenus.map((subItem) => (
//               <ListItemButton
//                 key={subItem.title}
//                 component={RouterLink}
//                 href={subItem.path}
//                 sx={{
//                   minHeight: 44,
//                   borderRadius: 0.75,
//                   typography: 'body2',
//                   color: 'text.secondary',
//                   textTransform: 'capitalize',
//                   fontWeight: 'fontWeightMedium',
//                   ...(subItem.path === pathname && {
//                     color: 'primary.main',
//                     fontWeight: 'fontWeightSemiBold',
//                     bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
//                     '&:hover': {
//                       bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
//                     },
//                   }),
//                 }}
//               >
//                 <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
//                   {subItem.icon ? subItem.icon : icon(subItem.iconName)}
//                 </Box>
//                 <Box component="span">{subItem.title}</Box>
//               </ListItemButton>
//             ))}
//           </Stack>
//         </Collapse>
//       )}
//     </>
//   );
// }

// NavItem.propTypes = {
//   item: PropTypes.object,
// };
