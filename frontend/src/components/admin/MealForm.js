import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Box,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Alert,
  InputAdornment,
  Fade,
  Slide,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Restaurant as RestaurantIcon,
  AttachMoney as MoneyIcon,
  Image as ImageIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MealForm = ({ open, handleClose, onSubmit, initialData, loading = false }) => {
  const theme = useTheme();
  const [meal, setMeal] = useState({
    name: '',
    halfPrice: '',
    fullPrice: '',
    availability: false,
    image: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Reset the form properly when initialData changes
  useEffect(() => {
    if (initialData && open) {
      setMeal({
        id: initialData.id,
        name: initialData.name || '',
        halfPrice: initialData.half_price || '',
        fullPrice: initialData.full_price || '',
        availability: initialData.availability ?? false,
        image: null
      });
      // Set existing image preview if available
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    } else if (!initialData && open) {
      setMeal({
        name: '',
        halfPrice: '',
        fullPrice: '',
        availability: false,
        image: null
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [initialData, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!meal.name.trim()) {
      newErrors.name = 'Meal name is required';
    }
    
    if (!meal.halfPrice || parseFloat(meal.halfPrice) <= 0) {
      newErrors.halfPrice = 'Half price must be greater than 0';
    }
    
    if (!meal.fullPrice || parseFloat(meal.fullPrice) <= 0) {
      newErrors.fullPrice = 'Full price must be greater than 0';
    }
    
    if (meal.halfPrice && meal.fullPrice && parseFloat(meal.halfPrice) >= parseFloat(meal.fullPrice)) {
      newErrors.halfPrice = 'Half price must be less than full price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeal((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (e) => {
    setMeal((prev) => ({ ...prev, availability: e.target.checked }));
  };

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setMeal((prev) => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: '' }));
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleRemoveImage = () => {
    setMeal((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(meal);
    }
  };

  const handleDialogClose = () => {
    if (!loading) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        }
      }}
    >
      {/* Custom Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          p: 3,
          position: 'relative'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.2),
              color: 'white'
            }}
          >
            <RestaurantIcon />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h5" fontWeight="bold">
              {initialData ? 'Edit Meal' : 'Add New Meal'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {initialData ? 'Update meal information' : 'Create a delicious new meal offering'}
            </Typography>
          </Box>
          <IconButton
            onClick={handleDialogClose}
            disabled={loading}
            sx={{
              color: 'white',
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Fade in={open} timeout={600}>
          <Stack spacing={3}>
            {/* Meal Name */}
            <div>
               
            </div>
            <TextField
              label="Meal Name"
              name="name"
              value={meal.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RestaurantIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />

            {/* Price Fields */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="Half Portion Price"
                name="halfPrice"
                type="number"
                value={meal.halfPrice}
                onChange={handleChange}
                error={!!errors.halfPrice}
                helperText={errors.halfPrice}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <TextField
                label="Full Portion Price"
                name="fullPrice"
                type="number"
                value={meal.fullPrice}
                onChange={handleChange}
                error={!!errors.fullPrice}
                helperText={errors.fullPrice}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>

            {/* Availability Switch */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: `2px solid ${meal.availability ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.grey[300], 0.5)}`,
                background: meal.availability 
                  ? alpha(theme.palette.success.main, 0.05)
                  : alpha(theme.palette.grey[50], 0.5),
                transition: 'all 0.3s ease'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  {meal.availability ? (
                    <CheckIcon color="success" fontSize="large" />
                  ) : (
                    <CancelIcon color="error" fontSize="large" />
                  )}
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Meal Availability
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meal.availability ? 'Customers can order this meal' : 'Meal is currently unavailable'}
                    </Typography>
                  </Box>
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={meal.availability}
                      onChange={handleSwitchChange}
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
              </Box>
            </Box>

            {/* Image Upload Section */}
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Meal Image
              </Typography>
              
              {/* Drag & Drop Area */}
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.grey[300]}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: isDragging ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  }
                }}
              >
                {imagePreview ? (
                  <Box>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        maxWidth: 200,
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 2
                      }}
                    />
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                        sx={{ borderRadius: 2 }}
                      >
                        Change Image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleFileInputChange}
                        />
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleRemoveImage}
                        sx={{ borderRadius: 2 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main'
                      }}
                    >
                      <ImageIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      Upload Meal Image
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Drag and drop an image here, or click to select
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      Choose Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileInputChange}
                      />
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Error Alert */}
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                Please fix the errors above before submitting.
              </Alert>
            )}
          </Stack>
        </Fade>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          backgroundColor: alpha(theme.palette.grey[50], 0.5),
          gap: 2
        }}
      >
        <Button
          onClick={handleDialogClose}
          disabled={loading}
          variant="outlined"
          color="error"
          size="large"
          sx={{
            borderRadius: 2,
            px: 4,
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          size="large"
          sx={{
            borderRadius: 2,
            px: 4,
            textTransform: 'none',
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            boxShadow: `0 3px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
              transform: 'translateY(-1px)',
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            initialData ? 'Update Meal' : 'Add Meal'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealForm;