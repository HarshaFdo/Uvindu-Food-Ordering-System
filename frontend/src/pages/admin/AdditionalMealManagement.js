import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Container,
  Paper,
  Box,
  Alert,
  Snackbar,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Restaurant as RestaurantIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import AdditionalMealTable from '../../components/admin/AdditionalMealTable';
import AdditionalMealForm from '../../components/admin/AdditionalMealForm';

const AdditionalMealManagement = () => {
  const theme = useTheme();
  const [meals, setMeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/additional-meals/');
      setMeals(res.data);
      
      // Calculate stats
      const total = res.data.length;
      const available = res.data.filter(meal => meal.availability).length;
      const unavailable = total - available;
      
      setStats({ total, available, unavailable });
      
      if (total === 0) {
        showSnackbar('No meals found. Add your first meal!', 'info');
      }
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      showSnackbar('Failed to load meals. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (meal) => {
    try {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append('name', meal.name);
      formData.append('price', meal.price);
      formData.append('availability', meal.availability);
      if (meal.image) formData.append('image', meal.image);

      if (meal.id) {
        await axios.put(`http://localhost:8000/api/additional-meals/${meal.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSnackbar('Meal updated successfully!', 'success');
      } else {
        await axios.post('http://localhost:8000/api/additional-meals/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSnackbar('Meal added successfully!', 'success');
      }

      await fetchMeals();
      setOpen(false);
      setSelectedMeal(null);
    } catch (error) {
      console.error("Validation error:", error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          'Failed to save meal. Please check your input.';
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (meal) => {
    setSelectedMeal(meal);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:8000/api/additional-meals/${id}/`);
        showSnackbar('Meal deleted successfully!', 'success');
        await fetchMeals();
      } catch (error) {
        console.error('Failed to delete meal:', error);
        showSnackbar('Failed to delete meal. Please try again.', 'error');
      }
    }
  };

  const handleToggleAvailability = async (meal) => {
    try {
      await axios.patch(`http://localhost:8000/api/additional-meals/${meal.id}/`, {
        availability: !meal.availability,
      });
      const action = !meal.availability ? 'enabled' : 'disabled';
      showSnackbar(`Meal ${action} successfully!`, 'success');
      await fetchMeals();
    } catch (error) {
      console.error('Failed to toggle availability:', error.response?.data || error);
      showSnackbar('Failed to update meal availability. Please try again.', 'error');
    }
  };

  const handleAddClick = () => {
    setSelectedMeal(null);
    setOpen(true);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const StatCard = ({ title, value, color, icon }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        }
      }}
    >
      <Box
        sx={{
          p: 1,
          borderRadius: '50%',
          backgroundColor: alpha(color, 0.1),
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <AdminLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
              {/* <Box display="flex" alignItems="center" gap={2} mb={2}>
                <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography 
                  variant="h3" 
                  fontWeight="bold"
                  sx={{
                    background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Additional Meals Management
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Manage your restaurant's additional meal offerings with ease
              </Typography> */}

              {/* Stats Cards */}
              <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3} mb={4}>
                <StatCard
                  title="Total Additional Meals"
                  value={stats.total}
                  color={theme.palette.primary.main}
                  icon={<RestaurantIcon />}
                />
                <StatCard
                  title="Available"
                  value={stats.available}
                  color={theme.palette.success.main}
                  icon={<Chip label="●" sx={{ minHeight: 'auto', height: 20 }} />}
                />
                <StatCard
                  title="Unavailable"
                  value={stats.unavailable}
                  color={theme.palette.warning.main}
                  icon={<Chip label="●" sx={{ minHeight: 'auto', height: 20 }} />}
                />
              </Box>

              {/* Action Buttons */}
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddClick}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 15px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #115293 30%, #1976d2 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Add New Additional Meal
                </Button>
                
                {/* <Tooltip title="Refresh data">
                  <IconButton
                    onClick={fetchMeals}
                    sx={{
                      border: `2px solid ${theme.palette.primary.main}`,
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        transform: 'rotate(180deg)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip> */}
              </Box>
            </Box>

            {/* Table Section */}
            <Paper 
              elevation={3}
              sx={{ 
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <AdditionalMealTable
                meals={meals}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleAvailability={handleToggleAvailability}
              />
            </Paper>

            {/* Form Dialog */}
            <AdditionalMealForm
              open={open}
              handleClose={() => {
                setOpen(false);
                setSelectedMeal(null);
              }}
              onSubmit={handleSubmit}
              initialData={selectedMeal}
              loading={submitLoading}
            />

            {/* Snackbar for notifications */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{
                  borderRadius: 2,
                  fontWeight: 'medium',
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Fade>
      </Container>
    </AdminLayout>
  );
};

export default AdditionalMealManagement;