import React, { useEffect, useState } from "react";
import "../assets/scss/orders.scss";
import axios from "axios";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders(); 
  }, []);

  return (
    <div className="container orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((o) => (
            <div key={o.id} className="order-card">
              <div className="order-header">
                <div>
                  <strong>Order:</strong> {o.id}
                </div>
                <div>{o.date}</div>
              </div>

              <div className="order-body">
                <div className="customer">
                  <strong>To:</strong> {o.customer.name} — {o.customer.email}
                </div>

                <div className="address">
                  <strong>Address:</strong> {o.customer.address}
                </div>

                <div>
                  <strong>Items:</strong>
                  <ul>
                    {o.items.split(",").map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="total">Total: ₹{o.total}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
