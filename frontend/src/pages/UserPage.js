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
  const [selectedAdditionalMeals, setSelectedAdditionalMeals] = useState({}); // New state
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

  const handleAdditionalMealChange = (mealId, additionalMealId) => {
    setSelectedAdditionalMeals({
      ...selectedAdditionalMeals,
      [mealId]: additionalMealId,
    });
  };

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.portion === item.portion &&
        // Fixed comparison logic
        ((item.additionalMeal === null && cartItem.additionalMeal === null) ||
          (item.additionalMeal !== null &&
            cartItem.additionalMeal !== null &&
            cartItem.additionalMeal.id === item.additionalMeal.id))
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, item]);
    }

    // Clear the additional meal selection for this meal after adding to cart
    setSelectedAdditionalMeals({
      ...selectedAdditionalMeals,
      [item.id]: null,
    });
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

  const recentOrders = orders
    .filter((order) => order.status.trim().toLowerCase() === "delivered")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  const activeOrders = orders.filter(
    (order) => order.status.toLowerCase() !== "delivered"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
      {/* Streamlined Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-orange-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-bold text-xl shadow-md">
                Uvindu Food Cabin
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-full">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {user?.name || "Guest"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Simplified Navigation */}
          <nav className="flex justify-center space-x-8 mt-4 border-t border-orange-100 pt-3">
            <button className="font-bold text-orange-500 pb-1 border-b-2 border-orange-400">
              Home
            </button>
            <button className="font-medium text-gray-600 hover:text-orange-500 transition-colors duration-200">
              Menu
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="font-medium text-gray-600 hover:text-orange-500 transition-colors duration-200"
            >
              My Orders
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Compact Order Status Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Active Orders */}
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Active Orders</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                </div>

                {activeOrders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-white/80 mb-4">No active orders</p>
                    <p className="text-white/60 text-sm">
                      Start ordering to track your meals
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white/15 backdrop-blur-sm rounded-xl p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">
                            Order #{order.id}
                          </span>
                          <span className="text-sm bg-green-400/20 px-2 py-1 rounded-full">
                            {order.status}
                          </span>
                        </div>
                        {order.eta_minutes && (
                          <p className="text-sm text-white/80">
                            ETA: {order.eta_minutes} minutes
                          </p>
                        )}
                        <button
                          onClick={() => navigate("/delivery-map")}
                          className="w-full mt-3 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          Track Order
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Recent Orders</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" />
                    </svg>
                  </div>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-white/80 mb-4">No recent orders</p>
                    <p className="text-white/60 text-sm">
                      Your order history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.slice(0, 2).map((order) => (
                      <div
                        key={order.id}
                        className="bg-white/15 backdrop-blur-sm rounded-xl p-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold">
                              Order #{order.id}
                            </span>
                            <p className="text-sm text-white/80">
                              Rs. {order.total ?? "N/A"}
                            </p>
                          </div>
                          <span className="text-xs bg-green-400/20 px-2 py-1 rounded-full">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full mt-2 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                      View All Orders
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Search */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search delicious meals..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-orange-200 focus:border-orange-400 shadow-md transition-all duration-200"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Meals Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">
                  Our{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    Menu
                  </span>
                </h2>
                <span className="bg-orange-100 px-3 py-1 rounded-full text-sm font-medium text-orange-600">
                  {filteredMeals.length} meals
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMeals.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      No meals found
                    </h3>
                    <button
                      onClick={() => setSearchText("")}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-md transition-all duration-200"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  filteredMeals.map((meal) => (
                    <Meal
                      key={meal.id}
                      meal={meal}
                      selectedPortion={selectedPortion[meal.id]}
                      selectedAdditionalMeal={selectedAdditionalMeals[meal.id]}
                      onPortionChange={handlePortionChange}
                      onAdditionalMealChange={handleAdditionalMealChange}
                      onAddToCart={addToCart}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="w-80 lg:w-96 sticky top-24 h-fit">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Your Cart</h3>
                  {cart.length > 0 && (
                    <span className="bg-white/20 px-2 py-1 rounded-full text-sm font-medium">
                      {cart.length} items
                    </span>
                  )}
                </div>
              </div>

              {cart.length === 0 ? (
                // Empty Cart Section
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0L5 21m0 0l2.5-5"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-700 mb-2">
                    Your cart is empty
                  </h4>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Browse our delicious menu and add your favorite meals to get
                    started!
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span>Fresh ingredients daily</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span>Fast delivery</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-yellow-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span>Quality guaranteed</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-h-[70vh] overflow-y-auto">
                  <Cart
                    cart={cart}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                    user={user}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UserPage;
