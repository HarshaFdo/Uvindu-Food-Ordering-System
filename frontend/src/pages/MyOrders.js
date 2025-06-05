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
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="p-2 border">{order.id}</td>
              <td className="p-2 border">Rs. {(order.price * order.quantity)}</td>
              <td className="p-2 border">
                {new Date(order.created_at).toLocaleString()}
              </td>
              <td className="p-2 border">
                {order.is_active ? "Preparing" : "Delivered"}
              </td>
              <td className="p-2 border">{order.meal || "-"}</td>
              <td className="p-2 border">
                {order.additional_meal|| "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyOrdersPage;
