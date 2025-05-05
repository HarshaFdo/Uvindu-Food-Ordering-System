import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const MealForm = ({ open, handleClose, handleSave, initialData }) => {
  const [meal, setMeal] = useState({
    name: '',
    halfPrice: '',
    fullPrice: '',
    availability: false,
    image: null,
    category: 'main', // default category
  });

  useEffect(() => {
    if (initialData) {
      setMeal({
        name: initialData.name || '',
        halfPrice: initialData.halfPrice || '',
        fullPrice: initialData.fullPrice || '',
        availability: initialData.availability || false,
        image: null, // Do not pre-fill image
        category: initialData.category || 'main',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMeal((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    setMeal((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setMeal((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload on form submission
    handleSave(meal); // Call handleSave from parent with meal data
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialData ? 'Edit Meal' : 'Add Meal'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Meal Name"
          type="text"
          fullWidth
          variant="outlined"
          value={meal.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="halfPrice"
          label="Half Price"
          type="number"
          fullWidth
          variant="outlined"
          value={meal.halfPrice}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="fullPrice"
          label="Full Price"
          type="number"
          fullWidth
          variant="outlined"
          value={meal.fullPrice}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={meal.category}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="main">Main Meal</MenuItem>
            <MenuItem value="additional">Additional Meal</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={meal.availability}
              onChange={handleChange}
              name="availability"
            />
          }
          label="Available"
        />
        <input type="file" onChange={handleFileChange} style={{ marginTop: 12 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealForm;
