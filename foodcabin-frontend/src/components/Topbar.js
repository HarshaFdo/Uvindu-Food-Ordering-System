import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Topbar = () => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <Typography variant="h6" noWrap component="div">
        Admin Dashboard - Uvindu Food Cabin
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Topbar;
