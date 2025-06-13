// components/Meal.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Meal({ 
  meal, 
  onAddToCart, 
  selectedPortion, 
  selectedAdditionalMeal,
  onPortionChange, 
  onAdditionalMealChange 
}) {
  const [additionalMeals, setAdditionalMeals] = useState([]);

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
      (am) => am.id === parseInt(selectedAdditionalMeal)
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

  const handleAdditionalMealChange = (e) => {
    const value = e.target.value;
    onAdditionalMealChange(meal.id, value === "" ? null : value);
  };

  return (
    <div className="bg-[#7EC646] rounded-2xl p-4 text-white shadow-lg">
      {/* Meal Image */}
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <img
          src={meal.image || "/api/placeholder/200/150"}
          alt={meal.name}
          className="w-full h-32 object-cover"
        />
      </div>

      {/* Meal Info */}
      <div className="mb-4">
        <h3 className="font-bold text-sm mb-1">{meal.name}</h3>
        <p className="text-xs opacity-80">
          Rs.{meal.full_price}/Rs.{meal.half_price}
        </p>
      </div>

      {/* Portion Selection */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          {/* Full Portion */}
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name={`portion-${meal.id}`}
              checked={selectedPortion === "full"}
              onChange={() => onPortionChange(meal.id, "full")}
              className="sr-only"
            />
            <div
              className={`w-3 h-3 rounded-full border-2 border-white flex items-center justify-center ${
                selectedPortion === "full" ? "bg-white" : "bg-transparent"
              }`}
            >
              {selectedPortion === "full" && (
                <div className="w-1.5 h-1.5 bg-[#7EC646] rounded-full"></div>
              )}
            </div>
            <span className="text-xs font-medium">Full</span>
          </label>

          {/* Half Portion */}
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name={`portion-${meal.id}`}
              checked={selectedPortion === "half"}
              onChange={() => onPortionChange(meal.id, "half")}
              className="sr-only"
            />
            <div
              className={`w-3 h-3 rounded-full border-2 border-white flex items-center justify-center ${
                selectedPortion === "half" ? "bg-white" : "bg-transparent"
              }`}
            >
              {selectedPortion === "half" && (
                <div className="w-1.5 h-1.5 bg-[#7EC646] rounded-full"></div>
              )}
            </div>
            <span className="text-xs font-medium">Half</span>
          </label>
        </div>

        {/* Additional Meals */}
        <div className="mb-3">
          <label className="text-xs font-medium opacity-90 block mb-1">
            Additional Meals
          </label>
          <select
            onChange={handleAdditionalMealChange}
            value={selectedAdditionalMeal || ""}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="" className="text-gray-800">
              None
            </option>
            {additionalMeals.map((am) => (
              <option key={am.id} value={am.id} className="text-gray-800">
                {am.name} (+Rs.{am.price})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-[#F97A48] hover:bg-[#e8693f] text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1"
      >
        <span>Add to cart</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10"
          />
        </svg>
      </button>
    </div>
  );
}

export default Meal;