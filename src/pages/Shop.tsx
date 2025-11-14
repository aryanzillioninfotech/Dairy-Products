import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "../assets/scss/shop.scss";

interface Product {
  id: string;
  title: string;
  price: number;
  img: string;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Fetch products from json-server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Add to Cart with toast feedback
  const handleAdd = (p: Product) => {
    addToCart(p);
    // toast.success("Item added to cart!");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading Products...</p>;

  return (
    <div className="shop container">
      <h2>Shop Products</h2>

      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
            <p>₹{item.price}</p>
            <button onClick={() => handleAdd(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
