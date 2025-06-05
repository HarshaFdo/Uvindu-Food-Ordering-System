import React, { useEffect, useState } from "react";
import axios from "axios";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Failed to fetch orders:", err));
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">My Orders</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Meal</th>
            <th className="p-2 border">Additional Meal</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            // --- Calculate total price including additional meals ---
            const totalPrice = order.items.reduce((total, item) => {
              const portion = item.portion;
              const mealPrice =
                portion === "half"
                  ? item.meal?.half_price || 0
                  : item.meal?.full_price || 0;

              const additionalPrice = item.additional_meal
                ? portion === "half"
                  ? item.additional_meal.half_price || 0
                  : item.additional_meal.full_price || 0
                : 0;

              return total + (mealPrice + additionalPrice) * item.quantity;
            }, 0);

            // --- Prepare meal names ---
            const mealNames = order.items
              .map((item) => item.meal?.name)
              .join(", ");

            const additionalMealNames =
              order.items
                .map((item) => item.additional_meal?.name)
                .filter(Boolean)
                .join(", ") || "-";
            return (
              <tr key={order.id}>
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">Rs. {totalPrice.toFixed(2)}</td>
                <td className="p-2 border">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="p-2 border">
                  {order.is_active ? "Preparing" : "Delivered"}
                </td>
                <td className="p-2 border">{mealNames}</td>
                <td className="p-2 border">{additionalMealNames}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MyOrdersPage;
