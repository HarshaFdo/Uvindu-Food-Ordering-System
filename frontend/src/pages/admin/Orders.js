// components/admin/Orders.js
import React from 'react';
import { Typography } from '@mui/material';
import AdminLayout from '../../layouts/AdminLayout';

const Orders = () => {
  return (
    
      <AdminLayout>
        <Typography variant="h4" gutterBottom>
          Orders Management
        </Typography>
        <Typography>
          Display list of orders here.
        </Typography>
      </AdminLayout>
      
  );
};

export default Orders;
