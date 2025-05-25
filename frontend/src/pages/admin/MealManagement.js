import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Paper,
  Fab,
  Snackbar,
  Alert,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Backdrop,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  Restaurant as RestaurantIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import MealTable from '../../components/admin/MealTable';
import MealForm from '../../components/admin/MealForm';

// Styled components for modern look
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'scale(1.05)',
  },
  zIndex: 1000,
}));

const SearchBox = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
    },
  },
}));

const MealManagement = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, meal: null });
  const [stats, setStats] = useState({ total: 0, available: 0, unavailable: 0 });
  
  const theme = useTheme();

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    filterMeals();
  }, [meals, searchTerm, filterStatus]);

  const fetchMeals = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      
      const response = await axios.get('http://localhost:8000/api/meals/');
      setMeals(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const available = response.data.filter(meal => meal.availability).length;
      const unavailable = total - available;
      setStats({ total, available, unavailable });
      
      if (!showLoading) {
        showSnackbar('Meals refreshed successfully', 'success');
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      showSnackbar('Failed to fetch meals. Please try again.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterMeals = () => {
    let filtered = meals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(meal =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(meal =>
        filterStatus === 'available' ? meal.availability : !meal.availability
      );
    }

    setFilteredMeals(filtered);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFormSubmit = async (meal) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', meal.name);
      formData.append('half_price', meal.halfPrice);
      formData.append('full_price', meal.fullPrice);
      formData.append('availability', meal.availability);
      if (meal.image) {
        formData.append('image', meal.image);
      }

      if (meal.id) {
        await axios.put(`http://localhost:8000/api/meals/${meal.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSnackbar('Meal updated successfully!', 'success');
      } else {
        await axios.post('http://localhost:8000/api/meals/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSnackbar('Meal added successfully!', 'success');
      }

      fetchMeals(false);
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Failed to save meal. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meal) => {
    setSelectedMeal(meal);
    setOpen(true);
  };

  const handleDeleteConfirm = (meal) => {
    setDeleteDialog({ open: true, meal });
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/api/meals/${deleteDialog.meal.id}/`);
      showSnackbar('Meal deleted successfully!', 'success');
      fetchMeals(false);
      setDeleteDialog({ open: false, meal: null });
    } catch (error) {
      console.error('Failed to delete meal:', error);
      showSnackbar('Failed to delete meal. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (meal) => {
    try {
      await axios.patch(`http://localhost:8000/api/meals/${meal.id}/`, {
        availability: !meal.availability,
      });
      showSnackbar(
        `Meal ${!meal.availability ? 'enabled' : 'disabled'} successfully!`,
        'success'
      );
      fetchMeals(false);
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      showSnackbar('Failed to update availability. Please try again.', 'error');
    }
  };

  const handleAddClick = () => {
    setSelectedMeal(null);
    setOpen(true);
  };

  const handleRefresh = () => {
    fetchMeals(false);
  };

  if (loading && meals.length === 0) {
    return (
      <AdminLayout>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="300px" height={60} sx={{ mb: 3 }} />
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RestaurantIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 0.5 }}>
                  Meal Management
                </Typography>
                <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                  Manage your restaurant's menu items and pricing
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Refresh data">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                }}
              >
                <RefreshIcon sx={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Tooltip>
          </Box> */}

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha('#667eea', 0.1),
                    }}
                  >
                    <InventoryIcon sx={{ color: '#667eea', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      Total Meals
                    </Typography>
                  </Box>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha('#4caf50', 0.1),
                    }}
                  >
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {stats.available}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      Available
                    </Typography>
                  </Box>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha('#f44336', 0.1),
                    }}
                  >
                    <InventoryIcon sx={{ color: '#f44336', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {stats.unavailable}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      Unavailable
                    </Typography>
                  </Box>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>
        </Box>

        {/* Actions and Filters */}
        <StyledPaper sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <SearchBox
              placeholder="Search meals..."
              variant="outlined"
              size="medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 300 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="All"
                onClick={() => setFilterStatus('all')}
                variant={filterStatus === 'all' ? 'filled' : 'outlined'}
                color={filterStatus === 'all' ? 'primary' : 'default'}
                sx={{ borderRadius: 2 }}
              />
              <Chip
                label="Available"
                onClick={() => setFilterStatus('available')}
                variant={filterStatus === 'available' ? 'filled' : 'outlined'}
                color={filterStatus === 'available' ? 'success' : 'default'}
                sx={{ borderRadius: 2 }}
              />
              <Chip
                label="Unavailable"
                onClick={() => setFilterStatus('unavailable')}
                variant={filterStatus === 'unavailable' ? 'filled' : 'outlined'}
                color={filterStatus === 'unavailable' ? 'error' : 'default'}
                sx={{ borderRadius: 2 }}
              />
            </Box>

            <ActionButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Add Meal
            </ActionButton>
          </Box>
        </StyledPaper>

        {/* Meals Table */}
        <StyledPaper>
          {filteredMeals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <RestaurantIcon sx={{ fontSize: 64, color: '#bdc3c7', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
                {searchTerm || filterStatus !== 'all'
                  ? 'No meals found matching your criteria'
                  : 'No meals available'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter settings'
                  : 'Start building your menu by adding your first meal'}
              </Typography>
            </Box>
          ) : (
            <MealTable
              meals={filteredMeals}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              onToggleAvailability={handleToggleAvailability}
            />
          )}
        </StyledPaper>

        {/* Floating Action Button */}
        {/* <FloatingActionButton onClick={handleAddClick}>
          <AddIcon />
        </FloatingActionButton> */}

        {/* Meal Form Dialog */}
        <MealForm
          open={open}
          handleClose={() => setOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedMeal}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, meal: null })}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e74c3c' }}>
              Confirm Delete
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>
              Are you sure you want to delete "{deleteDialog.meal?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setDeleteDialog({ open: false, meal: null })}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Loading Backdrop */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading && meals.length > 0}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default MealManagement;