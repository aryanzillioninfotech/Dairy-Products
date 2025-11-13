import React from "react";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";
import "../assets/scss/productCard.scss"; // 👈 import SCSS file

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.img} alt={product.title} className="product-card__img" />
      <h3 className="product-card__title">{product.title}</h3>
      <div className="product-card__price">₹{product.price}</div>
      <p className="product-card__desc">{product.desc}</p>
      <button
        className="product-card__btn"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
