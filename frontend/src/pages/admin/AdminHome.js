import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  Grow,
  Container
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as OrderIcon,
  Restaurant as RestaurantIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import AdminLayout from '../../layouts/AdminLayout';

const AdminHome = () => {
  const theme = useTheme();
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [orderTimeStatus, setOrderTimeStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [stats, setStats] = useState({
    // todayOrders: 0,
    weeklyGrowth: 12.5,
    activeUsers: 0,
    lastUpdated: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  // const loadDashboardData = async () => {
  //   setLoading(true);
  //   try {
  //     await Promise.all([
  //       fetchUserCount(),
  //       fetchOrderCount(),
  //       fetchOrderTimeStatus(),
  //       fetchAdditionalStats()
  //     ]);
  //     setStats(prev => ({ ...prev, lastUpdated: new Date().toLocaleTimeString() }));
  //   } catch (error) {
  //     showSnackbar('Failed to load dashboard data', 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUserCount = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user-count/');
      setUserCount(response.data.user_count);
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  };

  const fetchOrderCount = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get("http://localhost:8000/api/orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    setOrderCount(response.data.length);
    
    // Calculate today's orders (mock calculation)
    // const todayOrders = Math.floor(response.data.length * 0.1);
    // setStats(prev => ({ ...prev, todayOrders }));
  } catch (err) {
    console.error("Error fetching orders:", err);
    showSnackbar("Failed to load order count", "error");
    throw err;
  }
};

  const fetchAdditionalStats = async () => {
    try {
      // Mock additional stats - replace with real API calls
      setStats(prev => ({
        ...prev,
        activeUsers: Math.floor(userCount * 0.7), // 70% active users
        weeklyGrowth: 12.5 + Math.random() * 10 // Random growth between 12.5-22.5%
      }));
    } catch (err) {
      console.error('Error fetching additional stats:', err);
    }
  };

  const toggleOrderTimeStatus = async () => {
    const newStatus = !orderTimeStatus;
    setOrderTimeStatus(newStatus);

    try {
      await axios.post('http://localhost:8000/api/set-order-time-status/', { 
        status: newStatus 
      });
      showSnackbar(
        `Ordering time ${newStatus ? 'enabled' : 'disabled'} successfully!`,
        'success'
      );
    } catch (error) {
      // Revert the change if API call fails
      setOrderTimeStatus(!newStatus);
      showSnackbar('Failed to update ordering time status', 'error');
    }
  };

  const getOrderTimeStatus = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/get-order-time-status/');
    setOrderTimeStatus(response.data.status);
  } catch (error) {
    console.error('Failed to get ordering time status:', error);
  }
};

const loadDashboardData = async () => {
  setLoading(true);
  try {
    await Promise.all([
      fetchUserCount(),
      fetchOrderCount(),
      getOrderTimeStatus(),  // ← use GET to load real status
      fetchAdditionalStats()
    ]);
    setStats(prev => ({ ...prev, lastUpdated: new Date().toLocaleTimeString() }));
  } catch (error) {
    showSnackbar('Failed to load dashboard data', 'error');
  } finally {
    setLoading(false);
  }
};


  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    showSnackbar('Dashboard refreshed successfully!', 'success');
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

  const StatCard = ({ title, value, icon, color, subtitle, progress, trend }) => (
    <Grow in timeout={800}>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${alpha(color, 0.3)}`,
            border: `1px solid ${alpha(color, 0.4)}`,
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Avatar
              sx={{
                backgroundColor: alpha(color, 0.15),
                color: color,
                width: 50,
                height: 50,
              }}
            >
              {icon}
            </Avatar>
            {trend && (
              <Chip
                label={`+${trend}%`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 'bold'
                }}
              />
            )}
          </Box>
          
          <Typography variant="h3" fontWeight="bold" color={color} gutterBottom>
            {loading ? <CircularProgress size={20} /> : value}
          </Typography>
          
          <Typography variant="h6" color="text.primary" fontWeight="medium" gutterBottom>
            {title}
          </Typography>
          
          {subtitle && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {subtitle}
            </Typography>
          )}
          
          {progress !== undefined && (
            <Box mt={2}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: color,
                    borderRadius: 3,
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {progress}% of target
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );

  const OrderingTimeCard = () => (
    <Fade in timeout={1000}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: orderTimeStatus 
            ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
          border: `2px solid ${orderTimeStatus ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.error.main, 0.3)}`,
          transition: 'all 0.3s ease',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                backgroundColor: orderTimeStatus 
                  ? alpha(theme.palette.success.main, 0.2)
                  : alpha(theme.palette.error.main, 0.2),
                color: orderTimeStatus ? theme.palette.success.main : theme.palette.error.main,
                width: 60,
                height: 60,
              }}
            >
              {orderTimeStatus ? <CheckIcon fontSize="large" /> : <CancelIcon fontSize="large" />}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ordering System
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Control when customers can place orders
              </Typography>
            </Box>
          </Box>
          
          <Box textAlign="right">
            <FormControlLabel
              control={
                <Switch
                  checked={orderTimeStatus}
                  onChange={toggleOrderTimeStatus}
                  size="large"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.success.main,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: theme.palette.success.main,
                    },
                  }}
                />
              }
              label=""
            />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color={orderTimeStatus ? 'success.main' : 'error.main'}
            >
              {orderTimeStatus ? 'ACTIVE' : 'INACTIVE'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Fade>
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
        <Fade in timeout={600}>
          <Box>
            {/* Header */}
            {/* <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
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
                    Admin Dashboard
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Welcome back! Here's what's happening with your restaurant today.
                  </Typography>
                </Box>
              </Box>
              
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Box> */}

            {/* Ordering Time Control */}
            <Box mb={4}>
              <OrderingTimeCard />
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Users"
                  value={userCount}
                  icon={<PeopleIcon />}
                  color={theme.palette.primary.main}
                  subtitle="Registered customers"
                  // progress={75}
                  // trend={8.2}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Orders"
                  value={orderCount}
                  icon={<OrderIcon />}
                  color={theme.palette.success.main}
                  subtitle="All time orders"
                  // progress={85}
                  // trend={stats.weeklyGrowth}
                />
              </Grid>
              
              {/* <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Today's Orders"
                  value={stats.todayOrders}
                  icon={<AnalyticsIcon />}
                  color={theme.palette.warning.main}
                  subtitle="Orders placed today"
                  progress={60}
                />
              </Grid> */}
              
              {/* <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Users"
                  value={stats.activeUsers}
                  icon={<TrendingUpIcon />}
                  color={theme.palette.info.main}
                  subtitle="Users active this week"
                  progress={70}
                  trend={5.8}
                />
              </Grid> */}
            </Grid>

            {/* Additional Info */}
            {/* <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.8)} 0%, ${alpha(theme.palette.grey[50], 0.9)} 100%)`,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <TimeIcon color="primary" />
                  <Typography variant="body1" color="text.secondary">
                    Last updated: {stats.lastUpdated}
                  </Typography>
                </Box>
                <Chip
                  label="Live Data"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Paper> */}

            {/* Snackbar */}
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
                sx={{ borderRadius: 2, fontWeight: 'medium' }}
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

export default AdminHome;