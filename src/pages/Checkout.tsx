import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";
import "../assets/scss/checkout.scss";

declare global {
  interface Window {
    paypal: any;
  }
}

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [customer, setCustomer] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false); // ✅ to toggle PayPal button visibility
  const paypalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const cartRef = useRef(cart);
  const customerRef = useRef(customer);
  const totalRef = useRef(0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    cartRef.current = cart;
    customerRef.current = customer;
    totalRef.current = total;

    // 🧩 Simple validation check (run on every form update)
    const isValid =
      customer.name.trim() &&
      /\S+@\S+\.\S+/.test(customer.email) &&
      customer.address.trim();

    setFormValid(!!isValid);
  }, [cart, customer, total]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const c = customerRef.current;
    if (!c.name.trim() || !c.email.trim() || !c.address.trim()) {
      toast.error("Please fill in all fields before proceeding to payment.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(c.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  // ✅ Initialize PayPal only once
  useEffect(() => {
    if (!window.paypal || !paypalRef.current) return;

    const paypalButtons = window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "pill", label: "pay" },

      createOrder: (_data: any, actions: any) => {
        if (!validateForm()) {
          throw new Error("Form invalid — stop payment.");
        }
        return actions.order.create({
          purchase_units: [
            {
              description: "Dairy Product Purchase",
              amount: { currency_code: "INR", value: totalRef.current.toFixed(2) },
            },
          ],
        });
      },

      onApprove: async (_data: any, actions: any) => {
        setLoading(true);
        try {
          const order = await actions.order.capture();
          console.log("✅ Order captured:", order);

          const orderId = order.id;
          const items = cartRef.current.map((i) => `${i.title} x${i.quantity}`).join(", ");
          const orderData = {
            id: orderId,
            customer: customerRef.current,
            items,
            total: totalRef.current,
            status: "Paid",
            date: new Date().toLocaleString(),
          };

          const orders = JSON.parse(localStorage.getItem("orders") || "[]");
          orders.unshift(orderData);
          localStorage.setItem("orders", JSON.stringify(orders));

          await emailjs.send(
            "service_g7ltfyk",
            "template_f9cu75j",
            {
              to_name: customerRef.current.name,
              to_email: customerRef.current.email,
              order_id: orderId,
              order_summary: items,
              total: `₹${totalRef.current}`,
              address: customerRef.current.address,
            },
            "UDfYVwWgIqflar-pu"
          );

          toast.success("✅ Order placed successfully!");
          clearCart();
          navigate("/orders", { replace: true });
        } catch (err) {
          console.error("❌ Payment error:", err);
          toast.error("Payment failed. Please try again.");
        } finally {
          setLoading(false);
        }
      },

      onError: (err: any) => {
        console.error("⚠️ PayPal Error:", err);
        toast.error("Something went wrong with PayPal.");
      },
    });

    paypalButtons.render(paypalRef.current);
  }, [clearCart, navigate]);

  return (
    <div className="container">
      <h2>Checkout</h2>

      <div className="checkout-wrapper">
        <div className="checkout-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={customer.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={customer.email}
            onChange={handleChange}
          />
          <textarea
            name="address"
            placeholder="Delivery Address"
            value={customer.address}
            onChange={handleChange}
          />

          <h3>Order Summary</h3>
          {cart.map((i) => (
            <p key={i.id}>
              {i.title} × {i.quantity} — ₹{i.price * i.quantity}
            </p>
          ))}
          <h3>Total: ₹{total}</h3>
        </div>

        <div className="paypal-box">
          <h3>Pay Securely</h3>
          {/* ✅ Disable or hide PayPal button until form valid */}
          <div
            style={{
              opacity: formValid ? 1 : 0.4,
              pointerEvents: formValid ? "auto" : "none",
              transition: "opacity 0.3s",
            }}
          >
            <div ref={paypalRef}></div>
          </div>
          {!formValid && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              Please fill in your details to enable payment.
            </p>
          )}
          {loading && <p>Processing your payment...</p>}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
