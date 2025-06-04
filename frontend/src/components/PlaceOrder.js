import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

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
    if (!name || !phoneNumber || !hostel) {
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
      const response = await fetch("http://127.0.0.1:8000/api/place-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      const data = await response.json();
      console.log("Order placed successfully:", data);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-orange-100">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-700 mb-2">Loading your order...</p>
          <p className="text-gray-500">Please wait while we prepare everything</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
      {/* Enhanced Header with Glass Morphism */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-orange-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-black text-2xl shadow-lg">
                Uvindu
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black text-gray-800">
                  Complete Your <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Order</span>
                </h1>
                <p className="text-gray-600 font-medium">Almost there! Just a few more details</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/user", { state: { user } })}
              className="flex items-center space-x-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-orange-200 text-gray-700 px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Menu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 max-w-2xl mx-auto">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                ✓
              </div>
              <span className="ml-3 text-sm font-medium text-green-600">Menu Selection</span>
            </div>
            
            <div className="flex-1 h-1 bg-gradient-to-r from-green-400 to-orange-400 rounded-full"></div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                2
              </div>
              <span className="ml-3 text-sm font-medium text-orange-600">Order Details</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 rounded-full"></div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold">
                3
              </div>
              <span className="ml-3 text-sm font-medium text-gray-400">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Order Form */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border border-orange-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-8 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C17.52 2 22 6.48 22 12S17.52 22 12 22 2 17.52 2 12 6.48 2 12 2M7.07 18.28C7.5 17.38 10.12 16.5 12.1 16.5S16.7 17.38 17.13 18.28C15.58 19.36 13.86 20 12.1 20S8.62 19.36 7.07 18.28M18.36 16.83C16.93 15.09 13.46 14.5 12.1 14.5S7.27 15.09 5.84 16.83C4.62 15.5 4 13.82 4 12C4 7.59 7.59 4 12 4S20 7.59 20 12C20 13.82 19.38 15.5 18.36 16.83M12 6C10.06 6 8.5 7.56 8.5 9.5S10.06 13 12 13 15.5 11.44 15.5 9.5 13.94 6 12 6M12 11C11.17 11 10.5 10.33 10.5 9.5S11.17 8 12 8 13.5 8.67 13.5 9.5 12.83 11 12 11Z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Delivery Details</h2>
                    <p className="text-white/80 font-medium">Where should we deliver your delicious meal?</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {error && (
                  <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 animate-shake">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-red-800">Oops! Something went wrong</h4>
                        <p className="text-red-700 font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="group">
                    <label className="block mb-3 text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <span>Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 font-medium text-gray-700 placeholder-gray-500 group-hover:border-orange-300"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="group">
                    <label className="block mb-3 text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      <span>Phone Number</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 font-medium text-gray-700 placeholder-gray-500 group-hover:border-orange-300"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {/* Hostel Field */}
                  <div className="group">
                    <label className="block mb-3 text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                      <span>Hostel</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 font-medium text-gray-700 group-hover:border-orange-300 cursor-pointer"
                      required
                    >
                      <option value="">Select your hostel</option>
                      <option value="Hostel A">Hostel A</option>
                      <option value="Hostel B">Hostel B</option>
                      <option value="Hostel C">Hostel C</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Other Hostel Field */}
                  {hostel === "Other" && (
                    <div className="group animate-fadeIn">
                      <label className="block mb-3 text-sm font-bold text-gray-700 flex items-center space-x-2">
                        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>Hostel Name</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={otherHostel}
                        onChange={(e) => setOtherHostel(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 font-medium text-gray-700 placeholder-gray-500 group-hover:border-orange-300"
                        placeholder="Enter your hostel name"
                        required
                      />
                    </div>
                  )}

                  {/* Room Number Field */}
                  <div className="group">
                    <label className="block mb-3 text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                      <span>Room Number</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 font-medium text-gray-700 placeholder-gray-500 group-hover:border-orange-300"
                      placeholder="Enter your room number"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-5 px-8 rounded-2xl font-black text-lg text-white transition-all duration-300 transform shadow-xl ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 hover:scale-105 hover:shadow-2xl"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Placing Your Order...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span>Complete Order</span>
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Enhanced Order Summary */}
          <div className="w-full lg:w-96">
            <div className="sticky top-24 bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border border-orange-100 overflow-hidden">
              {/* Summary Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7M9 3V4H15V3H9M7 6V19H17V6H7Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-black">Order Summary</h3>
                      <p className="text-white/80 text-sm font-medium">{cart.length} delicious items</p>
                    </div>
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <span className="text-sm font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)} total qty</span>
                  </div>
                </div>
              </div>

              {/* Summary Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-4 border border-orange-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">🍽️</span>
                            <h4 className="font-bold text-gray-800 leading-tight">{item.name}</h4>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="bg-orange-100 px-2 py-1 rounded-full text-xs font-bold text-orange-700 capitalize">
                                {item.portion} portion
                              </span>
                              <span className="bg-yellow-100 px-2 py-1 rounded-full text-xs font-bold text-yellow-700">
                                ×{item.quantity}
                              </span>
                            </div>
                            
                            {item.additionalMeal && (
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm">➕</span>
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-medium">
                                  {item.additionalMeal.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-2 rounded-xl shadow-lg">
                            <p className="font-black text-lg">
                              Rs.{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Section */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z"/>
                        </svg>
                        <span className="text-xl font-black">Total Amount</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-3xl font-black text-white drop-shadow-lg">
                        Rs.{calculateTotal()}
                      </p>
                      <p className="text-white/80 text-sm font-medium mt-1">Including all charges</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                      </svg>
                      <span className="text-sm font-bold text-green-700">Free delivery to your hostel!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        /* Custom scrollbar */
        .max-h-96::-webkit-scrollbar {
          width: 6px;
        }
        
        .max-h-96::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .max-h-96::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 10px;
        }
        
        .max-h-96::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
      `}</style>
    </div>
  );
}

export default PlaceOrder;