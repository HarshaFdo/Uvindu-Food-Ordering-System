// components/Cart.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, removeFromCart, updateQuantity, user }) {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="bg-[#7EC646] rounded-2xl p-6 text-white sticky top-6">
      {/* Cart Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          Cart
          <svg
            className="w-6 h-6 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10"
            />
          </svg>
        </h2>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.map((item, index) => (
          <div key={index} className="bg-white/10 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                <p className="text-xs opacity-80 capitalize mb-1">
                  {item.portion}
                </p>
                {item.additionalMeal && (
                  <p className="text-xs opacity-80">
                    + {item.additionalMeal.name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  {(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-xs opacity-80">{item.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm hover:bg-white/30 transition-colors"
                >
                  -
                </button>
                <span className="text-sm font-medium min-w-[20px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm hover:bg-white/30 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="text-xs text-red-200 hover:text-red-100 underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total</span>
          <span className="text-xl font-bold">{calculateTotal()}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={() => navigate("/place-order", { state: { cart, user } })}
        className="w-full bg-[#F97A48] hover:bg-[#e8693f] text-white font-bold py-3 px-6 rounded-full transition-colors shadow-lg"
      >
        Place Order
      </button>
    </div>
  );
}

export default Cart;
