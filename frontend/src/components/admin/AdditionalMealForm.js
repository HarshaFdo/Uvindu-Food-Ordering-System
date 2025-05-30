import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Checkbox, FormControlLabel, Typography 
} from '@mui/material';

const AdditionalMealForm = ({ open, handleClose, onSubmit, initialData }) => {
  const [additionalmeal, setAdditionalMeal] = useState({
    name: '',
    price: '',
    availability: false,
    image: null
  });

  // Reset the form properly when initialData changes
  useEffect(() => {
    if (initialData && open) {
      setAdditionalMeal({
        id: initialData.id,
        name: initialData.name || '',
        price: initialData.price || '',
        availability: initialData.availability ?? false,
        image: null
      });
    } else if (!initialData && open) {
      setAdditionalMeal({
        name: '',
        price: '',
        availability: false,
        image: null
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdditionalMeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setAdditionalMeal((prev) => ({ ...prev, availability: e.target.checked }));
  };

  const handleImageChange = (e) => {
    setAdditionalMeal((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = () => {
    // Convert price to float and send to parent
    const data = {
      ...additionalmeal,
      price: parseFloat(additionalmeal.price)
    };
    onSubmit(data);
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
        {initialData ? 'Edit AdditionalMeal' : 'Add AdditionalMeal'}
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <TextField
          label="Additional Meal Name"
          name="name"
          value={additionalmeal.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={additionalmeal.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={additionalmeal.availability}
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

        {additionalmeal.image && (
          <Typography variant="body2" sx={{ mt: 1, ml: 1, color: 'text.secondary' }}>
            {additionalmeal.image.name}
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

export default AdditionalMealForm;
