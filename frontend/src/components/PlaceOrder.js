import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function PlaceOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, user } = location.state || {};

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hostel, setHostel] = useState("");
  const [otherHostel, setOtherHostel] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if no cart or user data
  useEffect(() => {
    if (!cart || cart.length === 0 || !user) {
      navigate("/");
      return;
    }
    setName(user.name || "");
  }, [cart, user, navigate]);

  const calculateTotal = () => {
    if (!cart) return "0.00";
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!name || !phoneNumber || !hostel || !roomNumber) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (hostel === "Other" && !otherHostel) {
      setError("Please enter the hostel name");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }

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
      alert("Order placed successfully!");
      navigate("/user", { state: { user } });
    } catch (error) {
      console.error(
        "Failed to place order:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading or redirect message if data is missing
  if (!cart || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">
            Complete Your Order
          </h1>
          <button
            onClick={() => navigate("/user", { state: { user } })}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Order Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Delivery Details
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97A48] focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97A48] focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel *
                  </label>
                  <select
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97A48] focus:border-transparent"
                    required
                  >
                    <option value="">Select Hostel</option>
                    <option value="Hostel A">Hostel A</option>
                    <option value="Hostel B">Hostel B</option>
                    <option value="Hostel C">Hostel C</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {hostel === "Other" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hostel Name *
                    </label>
                    <input
                      type="text"
                      value={otherHostel}
                      onChange={(e) => setOtherHostel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97A48] focus:border-transparent"
                      placeholder="Enter hostel name"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97A48] focus:border-transparent"
                    placeholder="Enter room number"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-colors ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#F97A48] hover:bg-[#e8693f]"
                  }`}
                >
                  {loading ? "Placing Order..." : "Complete Order"}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-80">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 capitalize">
                        {item.portion} portion × {item.quantity}
                      </p>
                      {item.additionalMeal && (
                        <p className="text-xs text-gray-500">
                          + {item.additionalMeal.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-gray-800">
                        Rs.{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-[#F97A48]">
                    Rs.{calculateTotal()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
