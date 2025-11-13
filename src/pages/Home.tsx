import React from "react";
import Hero from "../components/Hero";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import "../assets/scss/home.scss"

const Home: React.FC = () => (
    <div className="home">
        <Hero />
        <div className="container">
            <h2>Popular Picks</h2>
            <div className="grid">
                {products.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    </div>
);
export default Home;
