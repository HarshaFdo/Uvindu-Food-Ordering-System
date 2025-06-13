// pages/UserPage.js
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Meal from "../components/Meal";
import Cart from "../components/Cart";
import Footer from "../components/Footer";

function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedPortion, setSelectedPortion] = useState({});
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState("");

  console.log("Navigated to UserPage with user:", user);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/meals/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMeals(res.data))
        .catch((err) => console.error("Failed to fetch meals:", err));

      axios
        .get("http://127.0.0.1:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Failed to fetch orders:", err));
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handlePortionChange = (mealId, portion) => {
    setSelectedPortion({ ...selectedPortion, [mealId]: portion });
  };

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.portion === item.portion &&
        (!item.additionalMeal ||
          cartItem.additionalMeal?.id === item.additionalMeal.id)
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    setCart(updatedCart);
  };

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const pastOrders = orders.filter((order) => !order.is_active);
   
  const recentOrders = orders
  .filter((order) => order.status.trim().toLowerCase() === "delivered")
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  .slice(0, 3);


  const activeOrders = orders.filter(
    (order) => order.status.toLowerCase() !== "delivered"
  );
  



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 pb-20">
      {/* Enhanced Header with Glass Morphism */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-orange-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-black text-2xl shadow-lg">
                Uvindu
              </div>
              <div className="hidden md:block text-sm text-gray-500 font-medium">
                Delicious meals delivered fresh
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4 bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-full">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {user?.name || "Guest"}
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex justify-center space-x-8 mt-6 border-t border-orange-100 pt-4">
            <button className="relative font-bold text-orange-500 pb-2 transition-all duration-300 group">
              Home
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400 transform scale-x-100 transition-transform duration-300"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
            </button>
            
            <button className="font-medium text-gray-600 hover:text-orange-500 pb-2 transition-all duration-300 relative group">
              Menu
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
            
            <button
              className="font-medium text-gray-600 hover:text-orange-500 pb-2 transition-all duration-300 relative group"
              onClick={() => navigate("/my-orders")}
            >
              My Orders
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
            
            {/* <button className="font-medium text-gray-600 hover:text-orange-500 pb-2 transition-all duration-300 relative group">
              Pre-orders
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Enhanced Order Status Cards */}
            <div className="grid md:grid-cols-2 gap-8 p-1">
  {/* Active Order Card - Enhanced */}
  <div className="group relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-xl transform -translate-y-20 translate-x-20 transition-transform duration-1000 group-hover:translate-x-16 group-hover:-translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/15 rounded-full blur-lg transform translate-y-16 -translate-x-16 transition-transform duration-1000 group-hover:-translate-x-12 group-hover:translate-y-12"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-300/20 rounded-full blur-md transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 group-hover:scale-110"></div>
    </div>

    {/* Glass Morphism Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent backdrop-blur-[2px]"></div>

    <div className="relative z-10 p-8 text-white">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-black bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Active Order
          </h3>
          <div className="h-1 w-16 bg-gradient-to-r from-white/80 to-transparent rounded-full"></div>
        </div>
        <div className="relative">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          {activeOrders.length > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs font-bold text-green-900 border-2 border-white animate-pulse">
              {activeOrders.length}
            </div>
          )}
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30 transition-all duration-500 hover:scale-110">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-white/10 rounded-3xl mx-auto animate-ping"></div>
          </div>
          <h4 className="text-xl font-bold mb-3 text-white/90">No active orders</h4>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">Start ordering to see your active orders here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeOrders.map((order, index) => (
            <div 
              key={order.id} 
              className="bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/20 transition-all duration-500 hover:bg-white/20 hover:border-white/30 hover:shadow-lg transform hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="bg-white/25 px-4 py-2 rounded-full border border-white/30">
                  <span className="text-sm font-bold">Order #{order.id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-200">{order.status}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-3 bg-white/10 rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center text-xl shadow-lg">
                      🍽️
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{item.meal.name}</div>
                      <div className="text-white/70 text-sm">({item.portion})</div>
                    </div>
                    <div className="bg-white/20 px-3 py-2 rounded-xl text-sm font-bold border border-white/30">
                      ×{item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {order.eta_minutes && (
                <div className="flex items-center space-x-3 mb-6 p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg">ETA: {order.eta_minutes} minutes</div>
                    <div className="text-white/70 text-sm">Estimated delivery time</div>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/delivery-map")}
                className="group/btn w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm border border-white/30 hover:border-white/40 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Track Order</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Recent Orders Card - Enhanced */}
  <div className="group relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-3xl bg-gradient-to-br from-green-500 via-green-400 to-emerald-400">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-xl transform -translate-y-20 translate-x-20 transition-transform duration-1000 group-hover:translate-x-16 group-hover:-translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/15 rounded-full blur-lg transform translate-y-16 -translate-x-16 transition-transform duration-1000 group-hover:-translate-x-12 group-hover:translate-y-12"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-emerald-300/20 rounded-full blur-md transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 group-hover:scale-110"></div>
    </div>

    {/* Glass Morphism Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent backdrop-blur-[2px]"></div>

    <div className="relative z-10 p-8 text-gray-800">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-black bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Recent Orders
          </h3>
          <div className="h-1 w-16 bg-gradient-to-r from-white/80 to-transparent rounded-full"></div>
        </div>
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" />
          </svg>
        </div>
      </div>

      {recentOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30 transition-all duration-500 hover:scale-110">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold mb-3 text-white/90">No recent orders</h4>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentOrders.map((order, index) => (
            <div 
              key={order.id} 
              className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/30 px-3 py-1 rounded-full border border-white/40">
                      <span className="text-sm font-bold text-white">#{order.id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-200 capitalize">{order.status}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">Rs. {order.total ?? 'N/A'}</div>
                </div>
                <button className="group/view bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-300 font-medium border border-white/30 hover:border-white/40 text-white">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm">View Details</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/view:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="space-y-2 mt-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center text-sm">
                        🍽️
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-white">{item.meal?.name}</span>
                        <span className="text-white/70 text-sm ml-2">({item.portion})</span>
                      </div>
                      <div className="bg-white/20 px-2 py-1 rounded-lg text-sm font-bold text-white border border-white/30">
                        ×{item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button className="w-full text-center font-semibold bg-gradient-to-r from-white/15 to-white/10 hover:from-white/25 hover:to-white/15 py-4 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-white">
            <div className="flex items-center justify-center space-x-2">
              <span>View All Orders</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  </div>

  <style jsx>{`
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</div>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for delicious meals..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 shadow-lg transition-all duration-300 font-medium"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              
              {searchText && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4 z-30">
                  <p className="text-sm text-gray-600 mb-2">Searching for: <span className="font-bold text-orange-600">"{searchText}"</span></p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Found {filteredMeals.length} results</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>Press Enter to search</span>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Meals Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-gray-800">
                  Our <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Delicious</span> Menu
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="bg-orange-100 px-3 py-1 rounded-full font-medium">
                    {filteredMeals.length} meals available
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMeals.length === 0 ? (
                  <div className="col-span-full">
                    <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-orange-100">
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-700 mb-2">No meals found</h3>
                      <p className="text-gray-500 mb-6">Try adjusting your search terms or browse our full menu</p>
                      <button 
                        onClick={() => setSearchText("")}
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Clear Search
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredMeals.map((meal, index) => (
                    <div 
                      key={meal.id}
                      className="transform transition-all duration-300 hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slideInUp 0.6s ease-out forwards'
                      }}
                    >
                      <Meal
                        meal={meal}
                        selectedPortion={selectedPortion[meal.id]}
                        onPortionChange={handlePortionChange}
                        onAddToCart={addToCart}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Cart Sidebar */}
          {cart.length > 0 && (
            <div className="w-80 lg:w-96 sticky top-24 h-fit">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black">Your Order</h3>
                    <div className="bg-white/20 px-3 py-1 rounded-full">
                      <span className="text-sm font-bold">{cart.length} items</span>
                    </div>
                  </div>
                </div>
                
                <div className="max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out">
                  <Cart
                    cart={cart}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                    user={user}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Custom scrollbar for cart */
        .max-h-96::-webkit-scrollbar {
          width: 6px;
        }
        
        .max-h-96::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .max-h-96::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #fbbf24);
          border-radius: 10px;
        }
        
        .max-h-96::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #f59e0b);
        }
      `}</style>
    </div>
  );
}

export default UserPage;