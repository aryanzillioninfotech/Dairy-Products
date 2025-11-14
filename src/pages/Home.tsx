import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import "../assets/scss/home.scss";
import axios from "axios";
import type { Product } from "../data/products";

const Home: React.FC = () => {
  const [firstFour, setFirstFour] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFirstFourData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setFirstFour(res.data);
      } catch (error) {
        console.error("Error fetching first four products:", error);
      }
    };

    fetchFirstFourData();
  }, []);

  console.log(firstFour);

  return (
    <div className="home">
      <Hero />
      <div className="container">
        <h2>Popular Picks</h2>

        <div className="grid">
          {firstFour.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
