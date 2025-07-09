import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

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
    <div>
      
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4 lg:p-8">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-bold text-xl shadow-md">
                Uvindu Food Cabin
              </div>
            </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-800 mb-2">
            My <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Orders</span>
          </h1>
          <p className="text-gray-600 text-lg">Track your delicious food orders</p>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {orders.map((order) => {
            // Calculate total price including additional meals
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

            return (
              <div
                key={order.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/20 overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        #{order.id}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          order.is_active
                            ? "bg-orange-100 text-orange-700 border border-orange-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        {order.is_active ? "🔥 Preparing" : "✅ Delivered"}
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-800">Rs. {totalPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Total Amount</p>
                      </div>
                    </div>
                  </div>

                  {/* Meals Section */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Main Meals */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
                        🍽️ Main Meals
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          item.meal && (
                            <div key={idx} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-100">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-gray-800">{item.meal.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {item.portion} portion • Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-bold text-orange-600">
                                  Rs. {((item.portion === "half" ? item.meal.half_price : item.meal.full_price) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Additional Meals */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
                        ➕ Additional Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.some(item => item.additional_meal) ? (
                          order.items.map((item, idx) => (
                            item.additional_meal && (
                              <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold text-gray-800">{item.additional_meal.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {item.portion} portion • Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-bold text-green-600">
                                    Rs.{item.price}
                                  </p>
                                </div>
                              </div>
                            )
                          ))
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center">
                            <p className="text-gray-500 text-sm">No additional items</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🍽️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h3>
            <p className="text-gray-500">Start ordering your favorite meals!</p>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default MyOrdersPage;