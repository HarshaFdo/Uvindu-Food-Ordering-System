import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Checkbox, FormControlLabel
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
      key={initialData ? initialData.id : 'new'} // this helps reset the dialog
    >
      <DialogTitle>{initialData ? 'Edit Meal' : 'Add Meal'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Meal Name"
          name="name"
          value={meal.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Half Price"
          name="halfPrice"
          type="number"
          value={meal.halfPrice}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Full Price"
          name="fullPrice"
          type="number"
          value={meal.fullPrice}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={meal.availability}
              onChange={handleCheckboxChange}
              name="availability"
            />
          }
          label="Available"
        />
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        {meal.image && (
          <p style={{ marginTop: '10px' }}>{meal.image.name}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealForm;
