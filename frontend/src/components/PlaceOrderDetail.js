import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrderDetails = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    hostel: "",
    room: "",
  });

  const navigate = useNavigate();

  const hostels = [
    "Sarasavi Uyana",
    "Nipuna Nivasa",
    "Lakmahal",
    "Ganga Nivasa",
    "Other",
  ];

  const handleChange = (e) => {
    // const { name, value } = e.target;
    // setFormData(prev => ({ ...prev, [name]: value }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/place-order/", formData);
      alert("Order placed successfully!");
      navigate("/user", { state: { user: formData  } }); // 👈 Redirect after success
    } catch (error) {
      console.error("Order failed:", error);
      if (error.response && error.response.data) {
        console.log("Response data:", error.response.data);
        alert("Error: " + JSON.stringify(error.response.data));
      } else {
        alert("Something went wrong! Check backend server or network.");
      }
    }
  };

  return (
    <div className="max-w-md p-4 mx-auto border rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold">Place Your Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <select
          name="hostel"
          className="w-full p-2 border rounded"
          value={formData.hostel}
          onChange={handleChange}
          required
        >
          <option value="">Select Hostel</option>
          {hostels.map((h, i) => (
            <option key={i} value={h}>
              {h}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="room"
          placeholder="Room Number"
          className="w-full p-2 border rounded"
          value={formData.room}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrderDetails;
