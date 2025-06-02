import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  AppBar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  InputBase,
  Paper,
  Chip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Home,
  Restaurant,
  Add,
  ShoppingCart,
  Menu as MenuIcon,
  Search,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  Dashboard
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Speaker } from 'lucide-react';

const drawerWidth = 280;

// Styled components for modern look
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
    color: '#ffffff',
    borderRight: 'none',
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
  },
}));

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: '8px 16px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  ...(active && {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: '#ffffff',
      borderRadius: '0 4px 4px 0',
    },
  }),
  '&:hover': {
    backgroundColor: active ? undefined : alpha('#ffffff', 0.1),
    transform: 'translateX(4px)',
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
}));

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Dashboard, path: '/admin' },
    { id: 'meals', label: 'Meal Management', icon: Restaurant, path: '/admin/meals' },
    { id: 'additional', label: 'Additional Meals', icon: Add, path: '/admin/additionalmeals' },
    { id: 'orders', label: 'View Orders', icon: ShoppingCart, path: '/admin/orders' },
    { id: 'notification', label: 'Notification', icon: Bell, path: '/admin/notifications' },
    { id: 'advertisement', label: 'Advertisements', icon: Speaker, path: '/admin/advertisements' },
    { id: 'tracking', label: 'Tracking Map', icon: Home, path: '/tracking' }
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  const handleLogout = () => {
    // e.g., remove token from localStorage
    localStorage.removeItem('token');
    navigate('/');
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', py: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mr: 2
            }}
          >
            <Restaurant />
          </Avatar>
          {/* <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              Food Cabin
            </Typography>
            <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.7) }}>
              Admin Panel
            </Typography>
          </Box> */}
        </Box>
      </Toolbar>
      
      <Divider sx={{ borderColor: alpha('#ffffff', 0.1), mx: 2 }} />
      
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <StyledListItem
              button
              key={item.id}
              active={isActive}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <Icon />
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 'bold' : 'medium',
                  fontSize: '0.95rem'
                }}
              />
            </StyledListItem>
          );
        })}
      </List>

      {/* <Box sx={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
        <Paper
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha('#ffffff', 0.1)}`,
            borderRadius: 2
          }}
        >
          <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8), mb: 1 }}>
            Need Help?
          </Typography>
          <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.6) }}>
            Contact our support team for assistance
          </Typography>
        </Paper>
      </Box> */}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top Bar */}
      <StyledAppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Uvindu Food Cabin
          </Typography>

          {/* Search Bar */}
          {/* <SearchBox sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchBox> */}

          {/* Notifications */}
          {/* <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton> */}

          {/* Profile Menu */}
          <IconButton
            edge="end"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#ffffff', 0.2) }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        {/* <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><AccountCircle /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Settings /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider /> */}

        

        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {drawer}
        </StyledDrawer>
        
        {/* Desktop drawer */}
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
          }}
        >
          {drawer}
        </StyledDrawer>
      </Box>

      {/* Main Content */}
      <MainContent component="main" sx={{ width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                {getCurrentPageTitle()}
              </Typography>
              <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                Welcome back! Here's what's happening with your restaurant today.
              </Typography>
            </Box>
            <Chip
              label={new Date().toLocaleDateString()}
              color="primary"
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                fontWeight: 'medium',
                bgcolor: alpha('#667eea', 0.1),
                borderColor: '#667eea'
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <ContentCard>
          {children || (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Restaurant sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                Welcome to Your Dashboard
              </Typography>
              <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Start managing your restaurant operations by selecting an option from the sidebar menu.
              </Typography>
            </Box>
          )}
        </ContentCard>
      </MainContent>
    </Box>
  );
};

export default AdminLayout;