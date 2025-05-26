import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ActiveOrder from "../components/ActiveOrder";

function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedPortion, setSelectedPortion] = useState({});

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
    const portion = selectedPortion[meal.id] || 'full';
    const price = portion === 'full' ? meal.full_price : meal.half_price;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      item => item.id === meal.id && item.portion === portion
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const cartItem = {
        ...meal,
        portion,
        price,
        quantity: 1
      };
      setCart([...cart, cartItem]);
    }
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  if (!user) return null;

  return (
    <div style={{ 
      display: "flex",
      minHeight: "100vh"
    }}>
      {/* Main Content */}
      <div style={{ 
        flex: 3,
        padding: "2rem",
        maxWidth: "1200px",
        marginRight: cart.length > 0 ? "350px" : "0",
        transition: "margin-right 0.3s ease"
      }}>
        {/* User Profile Section */}
        <div style={{
          padding: "2rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "2rem"
        }}>
          <h1 style={{ marginBottom: "0.5rem" }}>Welcome, {user.name}!</h1>
          <p style={{ marginBottom: "1rem" }}><strong>Email:</strong> {user.email}</p>
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
        </div>

        {/* Order Tracking Section */}
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#e8f5e9",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "2rem"
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

             {/* ActiveOrder component */}
          <ActiveOrder />
        </div>

        {/* Meals Section */}
        <div style={{
          padding: "2rem",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Available Meals 🍽</h2>
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

      {/* Cart Sidebar */}
      {cart.length > 0 && (
        <div style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "350px",
          backgroundColor: "#fff",
          boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
          padding: "1.5rem",
          overflowY: "auto"
        }}>
          <h2 style={{ 
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid #eee"
          }}>
            Your Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </h2>
          
          {cart.map((item, index) => (
            <div key={index} style={{
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #f5f5f5"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4 style={{ margin: 0 }}>{item.name}</h4>
                <button 
                  onClick={() => removeFromCart(index)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4444",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  ×
                </button>
              </div>
              <p style={{ margin: "0.5rem 0", color: "#666" }}>
                {item.portion} portion - ${item.price} × {item.quantity}
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button 
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  style={{
                    padding: "0.2rem 0.5rem",
                    marginRight: "0.5rem",
                    backgroundColor: "#f5f5f5",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer"
                  }}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  style={{
                    padding: "0.2rem 0.5rem",
                    marginLeft: "0.5rem",
                    backgroundColor: "#f5f5f5",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer"
                  }}
                >
                  +
                </button>
                <span style={{ marginLeft: "auto", fontWeight: "bold" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          <div style={{ 
            marginTop: "2rem",
            paddingTop: "1rem",
            borderTop: "1px solid #eee"
          }}>
            <h3 style={{ 
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </h3>
            <button
              onClick={() => navigate("/checkout", { state: { cart } })}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "1rem",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;