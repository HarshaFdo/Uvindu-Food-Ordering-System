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
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <div className="px-4 py-4 bg-white shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Uvindu LOGO</h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-gray-600">
              {user?.name || "Guest"} | Notifications
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-4 space-x-8 text-gray-600">
          <button className="font-medium border-b-2 border-[#F97A48] text-[#F97A48] pb-1">
            Home
          </button>
          <button className="hover:text-[#F97A48]">Menu</button>
          <button
            className="hover:text-[#F97A48]"
            onClick={() => navigate("/my-orders")}
          >
            MyOrders
          </button>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-6 mx-auto">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Order Status Cards */}
            <div className="flex gap-4 mb-8">
              {/* Active Order */}
              <div className="flex-1 p-6 text-white bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl">
                <h3 className="mb-4 text-lg font-bold">Active Order</h3>
                {activeOrders.length === 0 ? (
                  <p className="text-sm opacity-90">No active orders.</p>
                ) : (
                  activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="pb-4 mb-6 border-b border-yellow-300"
                    >
                      <p className="mb-1 text-sm">Order No: #{order.id}</p>

                      {order.items.map((item, index) => (
                        <div key={index} className="pl-2 mb-1 text-sm">
                          🍽 <strong>{item.meal.name}</strong> ({item.portion}) ×{" "}
                          {item.quantity}
                          {item.additional_meal?.length > 0 && (
                            <span>
                              {" + "}
                              {item.additional_meal
                                .map((am) => am.name)
                                .join(", ")}
                            </span>
                          )}
                        </div>
                      ))}

                      <p className="mt-2 text-sm">
                        Status:{" "}
                        <span className="font-medium text-green-200">
                          {order.status}
                        </span>
                      </p>
                      {order.eta_minutes && (
                        <p className="text-sm">
                          ETA: {order.eta_minutes} minutes
                        </p>
                      )}

                      <button
                        onClick={() => navigate("/delivery-map")}
                        className="px-6 py-2 mt-3 text-sm font-medium transition-colors bg-red-500 rounded-full hover:bg-red-600"
                      >
                        Track Order
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Recent Orders */}
              <div className="flex-1 p-6 text-white bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl">
                <h3 className="mb-4 text-lg font-bold">Recent Orders</h3>
                {pastOrders.length === 0 ? (
                  <p className="text-sm opacity-90">No recent orders.</p>
                ) : (
                  <div className="space-y-3">
                    {pastOrders.slice(0, 2).map((order) => (
                      <div
                        key={order.id}
                        className="p-3 rounded-lg bg-white/20"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">Order : #{order.id}</p>
                            <p className="text-xs opacity-80">Rs.400</p>
                            <p className="text-xs opacity-80">Completed</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">
                              {order.items.map((item) => item.meal).join(", ")}
                            </p>
                            <button className="mt-1 text-xs underline">
                              View →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="text-sm underline">View All →</button>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Hinted search text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-gray-100 rounded-full px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F97A48]"
              />
              <button className="absolute transform -translate-y-1/2 right-3 top-1/2">
                <svg
                  className="w-5 h-5 text-gray-500"
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

            {/* Meals Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {filteredMeals.length === 0 ? (
                <div className="col-span-3 py-8 text-center">
                  <p className="text-gray-500">No meals available.</p>
                </div>
              ) : (
                filteredMeals.map((meal) => (
                  <Meal
                    key={meal.id}
                    meal={meal}
                    selectedPortion={selectedPortion[meal.id]}
                    onPortionChange={handlePortionChange}
                    onAddToCart={addToCart}
                  />
                ))
              )}
            </div>

            {/* Footer Banner */}
            <div>
              <Footer />
            </div>
          </div>

          {/* Cart Sidebar */}
          {cart.length > 0 && (
            <div className="w-80">
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

      {/* Logout Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white transition-colors bg-red-500 rounded-full shadow-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserPage;
