import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedPortion, setSelectedPortion] = useState({}); // Track selected portion for each meal

  useEffect(() => {
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

  const handlePortionChange = (mealId, portion) => {
    setSelectedPortion({
      ...selectedPortion,
      [mealId]: portion
    });
  };

  const addToCart = (meal) => {
    const portion = selectedPortion[meal.id] || 'full'; // Default to full if not selected
    const price = portion === 'full' ? meal.full_price : meal.half_price;
    
    const cartItem = {
      ...meal,
      portion,
      price,
      quantity: 1
    };

    setCart([...cart, cartItem]);
    alert(`${meal.name} (${portion} portion) added to cart!`);
  };

  const viewCart = () => {
    navigate("/cart", { state: { cart } });
  };

  if (!user) return null;

  return (
    <div style={{ 
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "2rem"
    }}>
      {/* User Profile Section */}
      <div style={{
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Welcome, {user.name}!</h1>
        <p style={{ marginBottom: "1rem" }}><strong>Email:</strong> {user.email}</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
          {cart.length > 0 && (
            <button 
              onClick={viewCart}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              View Cart ({cart.length})
            </button>
          )}
        </div>
      </div>

      {/* Order Tracking Section */}
      <div style={{
        padding: "1.5rem",
        backgroundColor: "#e8f5e9",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "1rem" }}>Order Management</h2>
        <button 
          onClick={() => navigate("/tracking")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Track Your Order
        </button>
      </div>

      {/* Meals Section */}
      <div style={{
        padding: "2rem",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Available Meals �</h2>
        {meals.length === 0 ? (
          <p>No meals available.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem"
          }}>
            {meals.map((meal) => (
              <div 
                key={meal.id}
                style={{
                  padding: "1.5rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  textAlign: "center"
                }}
              >
                <img
                  src={meal.image}
                  alt={meal.name}
                  style={{ 
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginBottom: "1rem"
                  }}
                />
                <h3 style={{ margin: "0.5rem 0" }}>{meal.name}</h3>
                
                {/* Portion Selection */}
                <div style={{ margin: "1rem 0" }}>
                  <label style={{ marginRight: "1rem" }}>
                    <input
                      type="radio"
                      name={`portion-${meal.id}`}
                      checked={selectedPortion[meal.id] === 'half'}
                      onChange={() => handlePortionChange(meal.id, 'half')}
                    />
                    Half: ${meal.half_price}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`portion-${meal.id}`}
                      checked={selectedPortion[meal.id] === 'full'}
                      onChange={() => handlePortionChange(meal.id, 'full')}
                    />
                    Full: ${meal.full_price}
                  </label>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(meal)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "100%"
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPage;