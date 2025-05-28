import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdvertisementTable from '../../components/admin/AdvertisementTable';
import AdvertisementForm from '../../components/admin/AdvertisementForm';
import { Snackbar, Alert, Button } from '@mui/material';
import AdminLayout from '../../layouts/AdminLayout';

const API_URL = 'http://localhost:8000/api/advertisements/';

function AdvertisementManagement() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setAds(res.data);
    } catch (error) {
      console.error('Failed to fetch advertisements:', error);
      showSnackbar('Error loading advertisements.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      };

      if (selectedAd) {
        await axios.put(`${API_URL}${selectedAd.id}/`, formData, config);
        showSnackbar('Advertisement updated successfully!', 'success');
      } else {
        await axios.post(API_URL, formData, config);
        showSnackbar('Advertisement created successfully!', 'success');
      }

      fetchAdvertisements();
      setOpenForm(false);
      setSelectedAd(null);
    } catch (error) {
      console.error('Form submission error:', error.response?.data || error);
      showSnackbar('Failed to save advertisement.', 'error');
    }
  };

  const handleEdit = (ad) => {
    setSelectedAd(ad);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${API_URL}${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar('Advertisement deleted successfully!', 'success');
        fetchAdvertisements();
      } catch (error) {
        console.error('Delete error:', error);
        showSnackbar('Failed to delete advertisement.', 'error');
      }
    }
  };

  return (
    <AdminLayout>
    <div style={{ padding: '2rem' }}>
      <h2>Advertisement Management</h2>
      <Button variant="contained" color="primary" onClick={() => { setSelectedAd(null); setOpenForm(true); }}>
        Add Advertisement
      </Button>

      <AdvertisementTable advertisements={ads} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />

      {openForm && (
        <AdvertisementForm
          advertisement={selectedAd}
          onSubmit={handleFormSubmit}
          onClose={() => setOpenForm(false)}
        />
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
    </AdminLayout>
  );
}

export default AdvertisementManagement;
