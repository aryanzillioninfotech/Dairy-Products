import React from "react";
import type { CartItem as CI } from "../context/CartContext";
import { useCart } from "../context/CartContext";
import "../assets/scss/_cartItem.scss"; // 👈 import SCSS file

const CartItemComp: React.FC<{ item: CI }> = ({ item }) => {
  const { updateQty, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img src={item.img} alt={item.title} className="cart-item__img" />

      <div className="cart-item__details">
        <strong className="cart-item__title">{item.title}</strong>
        <div className="cart-item__price">
          ₹{item.price} × {item.quantity} = <b>₹{item.price * item.quantity}</b>
        </div>
      </div>

      <div className="cart-item__actions">
        <button
          className="qty-btn"
          onClick={() => updateQty(item.id, item.quantity - 1)}
        >
          -
        </button>
        <div className="cart-item__quantity">{item.quantity}</div>
        <button
          className="qty-btn"
          onClick={() => updateQty(item.id, item.quantity + 1)}
        >
          +
        </button>
        <button
          className="remove-btn"
          onClick={() => removeFromCart(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemComp;
