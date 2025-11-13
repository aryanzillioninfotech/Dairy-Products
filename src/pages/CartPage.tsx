import React from "react";
import { useCart } from "../context/CartContext";
import CartItemComp from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";
import "../assets/scss/cart.scss"

const CartPage: React.FC = () => {
    const { cart,clearCart } = useCart();
    const navigate = useNavigate();
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <div className="container cart-page">
            <h2>Your Cart</h2>

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <Link to="/shop">
                        <button>Go to Shop</button>
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map(item => <CartItemComp key={item.id} item={item} />)}
                    </div>

                    <aside>
                        <div className="summary-box">
                            <h3>Order Summary</h3>
                            <div>Items: {cart.length}</div>
                            <div className="total">Total: ₹{total}</div>
                            <button onClick={() => navigate("/checkout")}>Checkout</button>
                            <button onClick={clearCart}>Clear Cart</button>
                        </div>
                    </aside>
                    <div>
                    </div>
                </div>
            )}
        </div>

    );
};
export default CartPage;
