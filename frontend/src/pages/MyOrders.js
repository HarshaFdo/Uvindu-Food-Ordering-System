import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]); 
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      
      fetch("http://127.0.0.1:8000/api/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error("Failed to fetch orders:", err));
    }
  }, []);

  

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div>
      {/* Streamlined Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-orange-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-bold text-xl shadow-md">
                Uvindu Food Cabin
              </div>
            </div>
            
           
          </div>

          
        </div>
      </header>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text mb-8">
            My Orders
          </h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No orders found</div>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => {
                const totalPrice = order.items.reduce((total, item) => {
                  const portion = item.portion;
                  const mealPrice = portion === "half" ? item.meal?.half_price || 0 : item.meal?.full_price || 0;
                  const additionalPrice = item.additional_meal
                    ? portion === "half" ? item.additional_meal.half_price || 0 : item.additional_meal.full_price || 0
                    : 0;
                  return total + (mealPrice + additionalPrice) * item.quantity;
                }, 0);

                const mealNames = order.items.map((item) => item.meal?.name).join(", ");
                const additionalMealNames = order.items
                  .map((item) => item.additional_meal?.name)
                  .filter(Boolean)
                  .join(", ") || "-";

                return (
                  <div
                    key={order.id}
                    className="backdrop-blur-sm bg-white/70 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-6 border border-white/20"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Order Header */}
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl px-4 py-2 font-bold text-lg">
                          #{order.id}
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                          Rs. {totalPrice.toFixed(2)}
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                          order.is_active 
                            ? 'bg-yellow-100 text-yellow-800 animate-pulse' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.is_active ? "🍳 Preparing" : "✅ Delivered"}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-gray-600 font-medium">
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Main Meals</h4>
                        <p className="text-gray-800 font-medium bg-orange-50 rounded-lg p-3">
                          {mealNames}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Additional Meals</h4>
                        <p className="text-gray-800 font-medium bg-yellow-50 rounded-lg p-3">
                          {additionalMealNames}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </div>
    
  );
}

export default MyOrdersPage;