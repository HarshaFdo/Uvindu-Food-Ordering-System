import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // Make sure axios is imported
import { Image } from "@mui/icons-material";

function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user; // Get user data from navigation state
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      navigate("/");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/meals/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setMeals(res.data))
        .catch((err) => console.error("Failed to fetch meals:", err));
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };
  // If no user info, show nothing while redirecting
  if (!user) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
        Logout
      </button>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Available Meals 🍽️</h2>
      {meals.length === 0 ? (
        <p>No meals available.</p>
      ) : (
        <ul>
          {meals.map((meal, index) => (
            <li key={index} style={{ marginBottom: "1rem" }}>
              <img
                src={meal.image}
                alt={meal.name}
                style={{ width: "200px", height: "auto", marginBottom: "1rem" }}
              />
              <h1>{meal.name}</h1>
              <h2>Half Price = {meal.half_price}</h2>
              <h2>Full Price = {meal.full_price}</h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserPage;



// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA