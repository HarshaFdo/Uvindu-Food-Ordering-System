// src/pages/admin/MealManagement.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
} from '@mui/material';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import MealTable from '../../components/admin/MealTable';
import MealForm from '../../components/admin/MealForm';

const MealManagement = () => {
  const [meals, setMeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    const response = await axios.get('http://localhost:8000/api/meals/');
    setMeals(response.data);
  };

  const handleFormSubmit = async (meal) => {
    try {
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
      } else {
        await axios.post('http://localhost:8000/api/meals/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      fetchMeals();
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit form.');
    }
  };

  const handleEdit = (meal) => {
    setSelectedMeal(meal);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this meal?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/meals/${id}/`);
        fetchMeals();
      } catch (error) {
        console.error('Failed to delete meal:', error);
        alert('Delete failed. Please try again.');
      }
    }
  };

  const handleToggleAvailability = async (meal) => {
    try {
      await axios.patch(`http://localhost:8000/api/meals/${meal.id}/`, {
        availability: !meal.availability,
      });
      fetchMeals();
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    }
  };

  const handleAddClick = () => {
    setSelectedMeal(null);
    setOpen(true);
  };

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>Meals Management</Typography>
      <Button
        variant="contained"
        onClick={handleAddClick}
        sx={{
          mb: 2,
          px: 3,
          py: 1,
          backgroundColor: '#1976d2',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: 2,
          textTransform: 'none',
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#115293',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        Add Meal
      </Button>

      <MealTable
        meals={meals}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleAvailability={handleToggleAvailability}
      />
      <MealForm
        open={open}
        handleClose={() => setOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMeal}
      />
    </AdminLayout>
  );
};

export default MealManagement;
