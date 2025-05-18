// src/layouts/AdminLayout.js
import React from 'react';
import { Box, CssBaseline, Toolbar, AppBar, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Topbar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Uvindu Food Cabin - Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1e1e2f',
            color: '#ffffff',
            borderRight: '1px solid #444',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            paddingTop: '20px',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => navigate('/admin')} sx={{ '&:hover': { backgroundColor: '#333' }, py: 1.5 }}>
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>
            <ListItem button onClick={() => navigate('/admin/meals')} sx={{ '&:hover': { backgroundColor: '#333' }, py: 1.5 }}>
              <ListItemText primary="Meal Management" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>
            <ListItem button onClick={() => navigate('/admin/orders')} sx={{ '&:hover': { backgroundColor: '#333' }, py: 1.5 }}>
              <ListItemText primary="View Orders" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
