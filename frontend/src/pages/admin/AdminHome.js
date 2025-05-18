// src/pages/admin/AdminHome.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import AdminLayout from '../../layouts/AdminLayout';

const AdminHome = () => {
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  // const [orderTimeStatus, setOrderTimeStatus] = useState(false);

  useEffect(() => {
    fetchUserCount();
    fetchOrderCount();
    // fetchOrderTimeStatus();
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user-count/');
      setUserCount(response.data.user_count);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchOrderCount = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders/');
      setOrderCount(response.data.length);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // const fetchOrderTimeStatus = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/api/order-status/');
  //     setOrderTimeStatus(response.data.is_ordering_enabled);
  //   } catch (err) {
  //     console.error('Error fetching order time status:', err);
  //   }
  // };

  // const handleToggle = async () => {
  //   try {
  //     await axios.patch('http://localhost:8000/api/order-status/', {
  //       is_ordering_enabled: !orderTimeStatus
  //     });
  //     setOrderTimeStatus(!orderTimeStatus);
  //   } catch (err) {
  //     console.error('Error updating status:', err);
  //   }
  // };

  return (
    <AdminLayout>
      
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard Home
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              backgroundColor: '#f0f4ff', // light blue background
              borderRadius: 3,
              textAlign: 'center',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 1 }}>
              Total Users
            </Typography>
            <Typography variant="h3" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
              {userCount}
            </Typography>
          </Paper>
        </Grid>


        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              backgroundColor: '#f0f4ff', // light blue background
              borderRadius: 3,
              textAlign: 'center',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 1 }}>Total Orders</Typography>
            <Typography variant="h3" sx={{ color: '#1a237e', fontWeight: 'bold' }}>{orderCount}</Typography>
          </Paper>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6">Order Time Status</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={orderTimeStatus}
                  onChange={handleToggle}
                  color="primary"
                />
              }
              label={orderTimeStatus ? "Ordering Enabled" : "Ordering Disabled"}
            />
          </Paper>
        </Grid> */}
      </Grid>
    </Box>
    </AdminLayout>
  );
};

export default AdminHome;
