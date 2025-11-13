import React from "react";
import { Link } from "react-router-dom";
import "../assets/scss/hero.scss"; // 👈 import SCSS

const Hero: React.FC = () => (
  <section className="hero container">
    <div className="hero__text">
      <h1>Fresh Dairy, Delivered Daily</h1>
      <p>
        Farm-to-doorstep milk, paneer, butter and ghee — sourced fresh every
        morning.
      </p>
      <div className="hero__cta">
        <Link to="/shop">
          <button className="hero__btn">Shop Now</button>
        </Link>
      </div>
    </div>

    <div className="hero__img">
      <img src="/images/image.png" alt="milk hero" />
    </div>
  </section>
);

export default Hero;
