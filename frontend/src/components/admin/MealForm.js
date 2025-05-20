import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Checkbox, FormControlLabel, Typography 
} from '@mui/material';


const MealForm = ({ open, handleClose, onSubmit, initialData }) => {
  const [meal, setMeal] = useState({
    name: '',
    halfPrice: '',
    fullPrice: '',
    availability: false,
    image: null
  });

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
    } else if (!initialData && open) {
      setMeal({
        name: '',
        halfPrice: '',
        fullPrice: '',
        availability: false,
        image: null
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setMeal((prev) => ({ ...prev, availability: e.target.checked }));
  };

  const handleImageChange = (e) => {
    setMeal((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = () => {
    onSubmit(meal);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      key={initialData ? initialData.id : 'new'}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', pb: 1 }}>
        {initialData ? 'Edit Meal' : 'Add Meal'}
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <TextField
          label="Meal Name"
          name="name"
          value={meal.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Half Price"
          name="halfPrice"
          type="number"
          value={meal.halfPrice}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Full Price"
          name="fullPrice"
          type="number"
          value={meal.fullPrice}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={meal.availability}
              onChange={handleCheckboxChange}
              name="availability"
              color="primary"
            />
          }
          label="Available"
          sx={{ mt: 1 }}
        />

        <Button
          variant="outlined"
          component="label"
          sx={{
            mt: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {meal.image && (
          <Typography variant="body2" sx={{ mt: 1, ml: 1, color: 'text.secondary' }}>
            {meal.image.name}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="error" variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
          {initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>

  );
};

export default MealForm;
