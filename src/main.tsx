import ReactDOM from "react-dom/client";
import "./assets/scss/main.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
);
