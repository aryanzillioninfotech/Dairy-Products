import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "../data/products";
import toast from "react-hot-toast";
import axios from "axios";

export type CartItem = Product & { quantity: number };

type CartContextType = {
    cart: CartItem[];
    addToCart: (p: Product) => void;
    removeFromCart: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const fetchCart = async () => {
        try {
            const res = await axios.get("http://localhost:5000/cart");
            setCart(res.data);
        } catch (error) {
            toast.error("Failed to load cart");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (p: Product) => {
        const existing = cart.find((i) => i.id === p.id);

        if (existing) return toast.error("Already in cart");

        try {
            await axios.post("http://localhost:5000/cart", { ...p, quantity: 1 });
            fetchCart();
            toast.success("Added to cart");
        } catch (error) {
            console.log(error);
        }
    };

    const removeFromCart = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/cart/${id}`);
            fetchCart();
        } catch (error) {
            console.log(error);
        }
    };

    const updateQty = async (id: string, qty: number) => {
        if (qty <= 0) return removeFromCart(id);

        try {
            // const item = cart.find((i) => i.id === id);
            await axios.patch(`http://localhost:5000/cart/${id}`, { quantity: qty });
            fetchCart();
        } catch (error) {
            console.log(error);
        }
    };

    const clearCart = async () => {
        for (const item of cart) await axios.delete(`http://localhost:5000/cart/${item.id}`);
        fetchCart();
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be inside CartProvider");
    return ctx;
};
