// pages/UserPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Meal from "../components/Meal";
import Cart from "../components/Cart";

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
    setSelectedPortion({ ...selectedPortion, [mealId]: portion });
  };

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.portion === item.portion &&
        (!item.additionalMeal || cartItem.additionalMeal?.id === item.additionalMeal.id)
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    setCart(updatedCart);
  };

  if (!user) return null;

  return (
    <div>
      <div>
        <h1>Welcome, {user.name}!</h1>
        <p>Email: {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => navigate("/tracking")}>Track Your Order</button>
      </div>

      <div>
        <h2>Available Meals</h2>
        <div>
          {meals.length === 0 ? (
            <p>No meals available.</p>
          ) : (
            meals.map((meal) => (
              <Meal
                key={meal.id}
                meal={meal}
                selectedPortion={selectedPortion[meal.id]}
                onPortionChange={handlePortionChange}
                onAddToCart={addToCart}
              />
            ))
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <div>
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        </div>
      )}
    </div>
  );
}

export default UserPage;
