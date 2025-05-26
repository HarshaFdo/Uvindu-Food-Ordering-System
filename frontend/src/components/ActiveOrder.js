// src/components/ActiveOrder.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const ActiveOrder = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get("http://127.0.0.1:8000/api/active-order/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("Failed to fetch active order:", err));
  }, []);

  if (!order) return <p>No active order found.</p>;

  return (
    <div
      style={{
        backgroundColor: "#fff3e0",
        padding: "1rem",
        borderRadius: "8px",
        marginTop: "1.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3>📦 Active Order</h3>
      <p>
        <strong>Order Number:</strong> {order.order_number}
      </p>
      <p>
        <strong>Order:</strong> {order.order}
      </p>
      <p>
        <strong>ETA:</strong> {order.eta}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
    </div>
  );
};

export default ActiveOrder;
