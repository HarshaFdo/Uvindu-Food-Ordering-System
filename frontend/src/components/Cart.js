// components/Cart.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, removeFromCart, updateQuantity }) {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div>
      <h2>Your Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})</h2>
      {cart.map((item, index) => (
        <div key={index}>
          <div>
            <h4>{item.name}</h4>
            <p>
              {item.portion} portion - ${item.price} × {item.quantity}
            </p>
            {item.additionalMeal && <p>+ {item.additionalMeal.name}</p>}
            <div>
              <button onClick={() => updateQuantity(index, item.quantity - 1)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(index, item.quantity + 1)}>
                +
              </button>
              <button onClick={() => removeFromCart(index)}>Remove</button>
            </div>
          </div>
        </div>
      ))}
      <div>
        <h3>Total: ${calculateTotal()}</h3>
        <button onClick={() => navigate("/place-order", { state: { cart } })}>
          Place order
        </button>
      </div>
    </div>
  );
}

export default Cart;
