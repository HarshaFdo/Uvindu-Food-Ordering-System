import React, { useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import AdditionalMealTable from '../../components/admin/AdditionalMealTable';
import AdditionalMealForm from '../../components/admin/AdditionalMealForm';

const AdditionalMealManagement = () => {
  const [meals, setMeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    const res = await axios.get('http://localhost:8000/api/additional-meals/');
    setMeals(res.data);
  };

  const handleSubmit = async (meal) => {
    try{
        const formData = new FormData();
        formData.append('name', meal.name);
        formData.append('price', meal.price);
        formData.append('availability', meal.availability);
        if (meal.image) formData.append('image', meal.image);

        if (meal.id) {
        await axios.put(`http://localhost:8000/api/additional-meals/${meal.id}/`, formData,{
            headers: { 'Content-Type': 'multipart/form-data', },
        });
        } else {
        await axios.post('http://localhost:8000/api/additional-meals/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        }

        fetchMeals();
        setOpen(false);
        } catch (error) {
        console.log("Validation error:", error.response?.data);
        }

        

  }

  const handleEdit = (meal) => {
    setSelectedMeal(meal);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`http://localhost:8000/api/additional-meals/${id}/`);
      fetchMeals();
    }
  };

    const handleToggleAvailability = async (meal) => {
    try {
        await axios.patch(`http://localhost:8000/api/additional-meals/${meal.id}/`, {
        availability: !meal.availability,
        });
        fetchMeals(); // refresh the table with updated data
    } catch (error) {
        console.error('Failed to toggle availability:', error.response?.data || error);
    }
    };


    const handleAddClick = () => {
        setSelectedMeal(null);
        setOpen(true);
    };

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>Additional Meals Management</Typography>
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
        Add Additional Meal
      </Button>
      <AdditionalMealTable
        meals={meals}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleAvailability={handleToggleAvailability}
      />
      <AdditionalMealForm
        open={open}
        handleClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedMeal}
      />
    </AdminLayout>
  );
};

export default AdditionalMealManagement;
