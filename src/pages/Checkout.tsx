// src/pages/Checkout.tsx
import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";
import "../assets/scss/checkout.scss";
import axios from "axios";

declare global {
  interface Window {
    paypal: any;
  }
}

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [customer, setCustomer] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const paypalRef = useRef<HTMLDivElement | null>(null);
  const paypalInstance = useRef<any>(null);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Live validation for showing the PayPal button (no toasts here)
  useEffect(() => {
    const isValid =
      !!customer.name.trim() &&
      /\S+@\S+\.\S+/.test(customer.email) &&
      !!customer.address.trim() &&
      total > 0;
    setFormValid(isValid);
  }, [customer, total]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Render or remove PayPal buttons based on formValid and total.
  useEffect(() => {
    // ensure SDK + container are available
    if (!paypalRef.current) return;
    // If PayPal SDK not loaded, bail (user must include script in index.html)
    if (!window.paypal) {
      console.error("PayPal SDK not loaded. Add script to index.html with your sandbox client ID.");
      return;
    }

    // If form invalid or cart empty -> remove buttons and reset instance
    if (!formValid) {
      // cleanup any existing buttons
      paypalRef.current.innerHTML = "";
      if (paypalInstance.current && typeof paypalInstance.current.close === "function") {
        try { paypalInstance.current.close(); } catch {}
      }
      paypalInstance.current = null;
      return;
    }

    // If already rendered, do nothing
    if (paypalInstance.current) return;

    // Render PayPal buttons once (only when formValid true)
    paypalInstance.current = window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "pill", label: "paypal" },

      // Do NOT run validation here. Button is only rendered when formValid === true.
      createOrder: (_data: any, actions: any) => {
        // double-check total
        if (total <= 0) {
          // return a rejected promise to stop creation; don't throw
          return Promise.reject(new Error("Cart total invalid"));
        }

        return actions.order.create({
          purchase_units: [
            {
              description: "Dairy Product Purchase",
              amount: {
                currency_code: "USD", // use USD for sandbox tests
                value: total.toFixed(2),
              },
            },
          ],
        });
      },

      onApprove: async (_data: any, actions: any) => {
  setLoading(true);
  try {
    const order = await actions.order.capture();
    console.log("Order captured:", order);

    const orderId = order.id;
    const items = cart.map((i) => `${i.title} ×${i.quantity}`).join(", ");

    const orderData = {
      id: orderId,
      customer,
      items,
      total,
      status: "Paid",
      date: new Date().toLocaleString(),
    };

    // 👉 Save order to json-server
    await axios.post("http://localhost:5000/orders", orderData);

    // 👉 Send confirmation email via EmailJS (unchanged)
    try {
      await emailjs.send(
        "service_g7ltfyk",
        "template_f9cu75j",
        {
          to_name: customer.name,
          to_email: customer.email,
          order_id: orderId,
          order_summary: items,
          total: `₹${total}`,
          address: customer.address,
        },
        "UDfYVwWgIqflar-pu"
      );
    } catch (emailErr) {
      console.error("EmailJS send failed:", emailErr);
    }

    toast.success("✅ Payment successful! Order placed.");

    // 👉 Clear cart in json-server
    await axios.patch("http://localhost:5000/cart", { cart: [] });

    clearCart(); // UI update only
    navigate("/orders", { replace: true });

  } catch (err) {
    console.error("PayPal capture error:", err);
    toast.error("Payment failed. Please try again.");
  } finally {
    setLoading(false);
  }
},


      onError: (err: any) => {
        console.error("PayPal SDK Error:", err);
        toast.error("Something went wrong with PayPal. Please try again.");
      },
    });

    // render and keep instance
    paypalInstance.current.render(paypalRef.current).catch((err: any) => {
      // rendering error
      console.error("PayPal render error:", err);
      toast.error("Failed to render PayPal. Please refresh and try again.");
      paypalRef.current && (paypalRef.current.innerHTML = "");
      paypalInstance.current = null;
    });

    // cleanup when unmount or when deps change
    return () => {
      if (paypalInstance.current && typeof paypalInstance.current.close === "function") {
        try { paypalInstance.current.close(); } catch {}
      }
      paypalInstance.current = null;
      if (paypalRef.current) paypalRef.current.innerHTML = "";
    };
    // Only depend on formValid & total (render only when these change)
  }, [formValid, total, cart, clearCart, navigate, customer]);

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

          {/* PayPal container - visible but will only contain the real button when formValid is true */}
          <div
            style={{
              opacity: formValid ? 1 : 0.5,
              pointerEvents: formValid ? "auto" : "none",
              transition: "opacity 0.25s",
              minHeight: 48,
            }}
          >
            <div ref={paypalRef} />
          </div>

          {!formValid && (
            <p style={{ color: "red", fontSize: "0.9rem", marginTop: 8 }}>
              Please fill all fields (name, valid email, address) and ensure cart has items to enable PayPal.
            </p>
          )}

          {loading && <p>Processing your payment...</p>}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
