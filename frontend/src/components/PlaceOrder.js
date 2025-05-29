import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function PlaceOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, user } = location.state;

  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hostel, setHostel] = useState("");
  const [otherHostel, setOtherHostel] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    const finalHostel = hostel === "Other" ? otherHostel : hostel;

    const payload = {
      name,
      phone_number: phoneNumber,
      hostel: finalHostel,
      room_number: roomNumber,
      items: cart.map((item) => ({
        meal: item.id,
        portion: item.portion,
        additional_meal: item.additionalMeal?.id || null,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/orders/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order placed successfully:", response.data);
      console.log("Navigating to /user with user:", user);
      navigate("/user", { state: { user } });
    } catch (error) {
      console.error(
        "Failed to place order:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h2>Enter Your Details</h2>
      <label>Name:</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <label>Phone Number:</label>
      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <br />
      <label>Hostel:</label>
      <select onChange={(e) => setHostel(e.target.value)}>
        <option value="">Select</option>
        <option value="Hostel A">Hostel A</option>
        <option value="Hostel B">Hostel B</option>
        <option value="Hostel C">Hostel C</option>
        <option value="Other">Other</option>
      </select>
      <br />
      {hostel === "Other" && (
        <>
          <label>Enter Hostel Name:</label>
          <input
            value={otherHostel}
            onChange={(e) => setOtherHostel(e.target.value)}
          />
          <br />
        </>
      )}
      <label>Room Number:</label>
      <input
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Complete Order</button>
    </div>
  );
}

export default PlaceOrder;
