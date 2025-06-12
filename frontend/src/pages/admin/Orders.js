// components/admin/Orders.js
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Chip, Typography, Box, Pagination, CircularProgress, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

import { Check, Close, Edit, Refresh } from '@mui/icons-material';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define possible status options
  const statusOptions = [
    'preparing',
    'out_for_delivery',
    'delivered'
    
  ];

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/api/orders/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  
  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        `http://localhost:8000/api/orders/${orderId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const [selectedHostel, setSelectedHostel] = useState('All');
  const hostels = ['All', ...new Set(orders.map(order => order.hostel))];

  const filteredOrders = selectedHostel === 'All'
  ? orders
  : orders.filter(order => order.hostel === selectedHostel);



  
useEffect(() => { fetchOrders(); }, []);

// Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      'preparing': 'default',
      'out_for_delivery': 'info',
      'delivered': 'success'
    };
    return colors[status] || 'default';
  };



  if (loading) return <Typography>Loading orders...</Typography>;

  return (
    
      <AdminLayout>
        <Box>
          <Typography variant="h5" gutterBottom>Order Management</Typography>
          
          {loading ? (
            <CircularProgress />
          ) : (
            
            <TableContainer component={Paper}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Orders</Typography>
                <Select
                  value={selectedHostel}
                  onChange={(e) => setSelectedHostel(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  {hostels.map((hostel) => (
                    <MenuItem key={hostel} value={hostel}>
                      {hostel}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    
                    <TableCell>Customer</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Location</TableCell>
                    
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Estimated Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>

                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.phone_number}</TableCell>
                      <TableCell>
                        <li>{order.hostel}</li>
                        <li>Room number {order.room_number}</li>
                      </TableCell>
                      
                      <TableCell>Rs. {order.total?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          size="small"
                          sx={{ minWidth: 120 }}
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell> {order.eta_minutes} minutes</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </AdminLayout>
      
  );
};

export default Orders;
