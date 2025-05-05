import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container } from '@mui/material';
import Mealtable from '../components/Mealtable';
import Mealform from '../components/Mealform';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const handleAddClick = () => {
    
    setOpen(true);
  };

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
    await axios.delete(`http://localhost:8000/api/meals/${id}/`);
    fetchMeals();
  };

  return (
    <Container sx={{ marginTop: 10 }}>
    <div style={{ padding: '2rem' }}>
      <h2> </h2>
      <Button variant="contained" onClick={handleAddClick} sx={{ mb: 2 }}>
        Add Meal
      </Button>
      <Mealtable meals={meals} onEdit={handleEdit} onDelete={handleDelete} />
      <Mealform
        open={open}
        handleClose={() => setOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMeal}
      />
    </div>
    </Container>
    
  );
};

export default Meals;
