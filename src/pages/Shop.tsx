import React from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const Shop: React.FC = () => (
  <div className="container shop-page">
    <h2>Shop All Products</h2>
    <div className="grid">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  </div>
);

export default Shop;
