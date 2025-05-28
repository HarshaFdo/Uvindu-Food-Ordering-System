// components/Meal.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Meal({ meal, onAddToCart, selectedPortion, onPortionChange }) {
  const [additionalMeals, setAdditionalMeals] = useState([]);
  const [selectedAdditional, setSelectedAdditional] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/additional-meals/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setAdditionalMeals(res.data))
        .catch((err) =>
          console.error("Failed to fetch additional meals:", err)
        );
    }
  }, []);

  const handleAddToCart = () => {
    const portion = selectedPortion || "full";
    const price = portion === "full" ? meal.full_price : meal.half_price;
    const additional = additionalMeals.find(
      (am) => am.id === parseInt(selectedAdditional)
    );

    const cartItem = {
      ...meal,
      portion,
      price:
        parseFloat(price) + (additional ? parseFloat(additional.price) : 0),
      quantity: 1,
      additionalMeal: additional || null,
    };

    onAddToCart(cartItem);
  };

  return (
    <div>
      <div>
        <img src={meal.image} alt={meal.name} />
        <h3>{meal.name}</h3>
        <div>
          <label>
            <input
              type="radio"
              name={`portion-${meal.id}`}
              checked={selectedPortion === "half"}
              onChange={() => onPortionChange(meal.id, "half")}
            />
            Half - ${meal.half_price}
          </label>
          <label>
            <input
              type="radio"
              name={`portion-${meal.id}`}
              checked={selectedPortion === "full"}
              onChange={() => onPortionChange(meal.id, "full")}
            />
            Full - ${meal.full_price}
          </label>
        </div>

        <div>
          <label>Additional Meal:</label>
          <select
            onChange={(e) => setSelectedAdditional(e.target.value)}
            defaultValue=""
          >
            <option value="">None</option>
            {additionalMeals.map((am) => (
              <option key={am.id} value={am.id}>
                {am.name} (+${am.price})
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default Meal;
