import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../assets/scss/navbar.scss"; // 👈 Import SCSS

const Navbar: React.FC = () => {
  const { cart } = useCart();
  const qty = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="navbar container">
      <div className="navbar__brand">
        <Link to="/">DairyDelights</Link>
      </div>

      <nav className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/cart">Cart ({qty})</Link>
      </nav>
    </header>
  );
};

export default Navbar;
