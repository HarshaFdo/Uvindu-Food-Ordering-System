import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Fade
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

import AdminLayout from '../../layouts/AdminLayout';
import NotificationForm from '../../components/admin/NotificationForm';
import NotificationTable from '../../components/admin/NotificationTable';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const API_URL = 'http://localhost:8000/api/notifications/';

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      showSnackbar('Error loading notifications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedNotification(null);
    setOpenForm(true);
  };

  const handleFormSubmit = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");

    const payload = {
      title: formData.title,
      content: formData.content,
      is_active: Boolean(formData.is_active),
    };

    if (selectedNotification && selectedNotification.id) {
      // Edit existing notification
      await axios.put(`${API_URL}${selectedNotification.id}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      showSnackbar('Notification updated successfully!', 'success');
    } else {
      // Create new notification
      await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      showSnackbar('Notification created successfully!', 'success');
    }

    fetchNotifications();
    setOpenForm(false);
    setSelectedNotification(null);
  } catch (error) {
    console.error('Form submission error:', error.response?.data || error);
    showSnackbar('Failed to save notification.', 'error');
  }
};

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`${API_URL}${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showSnackbar('Notification deleted successfully!', 'success');
        fetchNotifications();
      } catch (error) {
        console.error('Delete error:', error);
        showSnackbar('Failed to delete notification.', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Box>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" fontWeight="bold">
                Notification Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{ borderRadius: 3 }}
              >
                Add Notification
              </Button>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress size={50} />
              </Box>
            ) : (
              <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
                <NotificationTable
                  notifications={notifications}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Paper>
            )}

            <NotificationForm
              open={openForm}
              handleClose={() => {
                setOpenForm(false);
                setSelectedNotification(null);
              }}
              onSubmit={handleFormSubmit}
              initialData={selectedNotification}
            />

            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Fade>
      </Container>
    </AdminLayout>
  );
};

export default NotificationManagement;
