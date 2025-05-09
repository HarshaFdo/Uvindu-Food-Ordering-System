import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container } from '@mui/material';
import MealTable from '../components/admin/MealTable';
import MealForm from '../components/admin/MealForm';


const AdminDashboard = () => {
    const [meals, setMeals] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const user = location.state?.user;

    const handleAddClick = () => {
      
      setOpen(true);
    };
  
    useEffect(() => {
      fetchMeals();
    }, []);

    useEffect(() => {
        if (!user?.is_staff) {
          navigate("/"); 
        }
      }, [user, navigate]);

    
  
    const fetchMeals = async () => {
      const response = await axios.get('http://localhost:8000/api/meals/');
      console.log("Fetched meals:", response.data);
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
          fetchMeals();  // Refresh the list
        } catch (error) {
          console.error('Failed to toggle availability:', error);
        }
      };
      
  
    return (
      <Container sx={{ marginTop: 10 }}>
      <div style={{ padding: '2rem' }}>
        <h2>Admin Dashboard - Uvindu Food Cabin</h2>
        <Button variant="contained" onClick={handleAddClick} sx={{ mb: 2 }}>
          Add Meal
        </Button>
        {/* <MealTable meals={meals} onEdit={handleEdit} onDelete={handleDelete} /> */}
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
      </div>
      </Container>
      
    );
  };
  
  export default AdminDashboard;