import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


function PlaceOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [hostel, setHostel] = useState("");
  const [customHostel, setCustomHostel] = useState("");

  const hostels = ["Hostel A", "Hostel B", "Hostel C", "Hostel D", "Other"];

  const handleSubmit = async (e) => {
  e.preventDefault();

  const orderData = {
    name,
    room_number: roomNumber,
    hostel: hostel === "Other" ? customHostel : hostel,
    cart,
  };

  try {
    // Send order data to the backend
    const response = await axios.post("http://127.0.0.1:8000/api/orders/", orderData);

    // Redirect to user page after successful order placement
    navigate("/user", { state: { orderId: response.data.id } });

  } catch (error) {
    console.error("Order submission failed:", error);
    alert("Failed to place order. Please try again.");
  }
};

  return (
    <div>
      <h2>Place Your Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Your Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Room Number:</label>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Select Your Hostel:</label>
          <select
            value={hostel}
            onChange={(e) => setHostel(e.target.value)}
            required
          >
            <option value="">-- Select Hostel --</option>
            {hostels.map((h, index) => (
              <option key={index} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        {hostel === "Other" && (
          <div>
            <label>Enter Hostel Name:</label>
            <input
              type="text"
              value={customHostel}
              onChange={(e) => setCustomHostel(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit">Confirm Order</button>
      </form>
    </div>
  );
}

export default PlaceOrderPage;
