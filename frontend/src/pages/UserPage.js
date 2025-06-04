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

  const activeOrders = orders.filter((order) => order.is_active);
  const pastOrders = orders.filter((order) => !order.is_active);

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
              onClick={() => navigate("/orders")}
            >
              My Orders
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
            
            <button className="font-medium text-gray-600 hover:text-orange-500 pb-2 transition-all duration-300 relative group">
              Pre-orders
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Enhanced Order Status Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Active Order Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-95 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black">Active Order</h3>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {activeOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-white/80 font-medium">No active orders</p>
                      <p className="text-white/60 text-sm mt-1">Start ordering to see your active orders here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeOrders.map((order) => (
                        <div key={order.id} className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                          <div className="flex items-center justify-between mb-4">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                              Order #{order.id}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-green-200">{order.status}</span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-3 text-sm">
                                <span className="text-lg">🍽️</span>
                                <span className="font-medium">{item.meal.name}</span>
                                <span className="text-white/70">({item.portion})</span>
                                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                                  ×{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          {order.eta_minutes && (
                            <div className="flex items-center space-x-2 mb-4">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                              </svg>
                              <span className="text-sm font-medium">ETA: {order.eta_minutes} minutes</span>
                            </div>
                          )}

                          <button
                            onClick={() => navigate("/delivery-map")}
                            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 w-full"
                          >
                            Track Order →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-400 to-emerald-400 rounded-3xl p-8 text-gray-800 shadow-2xl transform hover:scale-95 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black">Recent Orders</h3>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {pastOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-white/80 font-medium">No recent orders</p>
                      <p className="text-white/60 text-sm mt-1">Your order history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastOrders.slice(0, 2).map((order) => (
                        <div key={order.id} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="bg-white/30 px-2 py-1 rounded-full text-xs font-bold">
                                  #{order.id}
                                </span>
                                <span className="text-xs text-white/70">Completed</span>
                              </div>
                              <p className="text-sm font-medium">Rs. 400</p>
                            </div>
                            <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-all duration-300 font-medium">
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button className="w-full text-center text-sm font-medium bg-white/10 hover:bg-white/20 py-3 rounded-2xl transition-all duration-300 border border-white/20">
                        View All Orders →
                      </button>
                    </div>
                  )}
                </div>
              </div>
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