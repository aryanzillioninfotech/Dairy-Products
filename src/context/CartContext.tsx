import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "../data/products";
import toast from "react-hot-toast";
// import { Product } from "../data/products";

export type CartItem = Product & { quantity: number; };

type CartContextType = {
    cart: CartItem[];
    addToCart: (p: Product) => void;
    removeFromCart: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const raw = localStorage.getItem("cart");
            return raw ? JSON.parse(raw) : [];
        } catch { return []; }
    });

    useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]);

    const addToCart = (p: Product) => {
        setCart((prev) => {
            const found = prev.find((x) => x.id === p.id);
            if (found) {
                toast.error("Item is already in cart!", {
                    style: {
                        border: "1px solid #b00020",
                        padding: "12px 16px",
                        color: "#b00020",
                        background: "#fff5f5",
                    },
                    iconTheme: {
                        primary: "#b00020",
                        secondary: "#fff",
                    },
                });
                return prev;
            } else {
                toast.success("Item added to cart!", {
                    style: {
                        border: "1px solid #3a5f0b",
                        padding: "12px 16px",
                        color: "#3a5f0b",
                        background: "#f5fff0",
                    },
                    iconTheme: {
                        primary: "#3a5f0b",
                        secondary: "#fff",
                    },
                });
            }

            return [...prev, { ...p, quantity: 1 }];
        });
    };


    const removeFromCart = (id: string) => {
        setCart((prev) => {
            const item = prev.find((i) => i.id === id);

            if (item) {
                toast.success(`${item.title} removed from cart!`, {
                    style: {
                        border: "1px solid #b00020",
                        padding: "12px 16px",
                        color: "#b00020",
                        background: "#fff5f5",
                    },
                    iconTheme: {
                        primary: "#b00020",
                        secondary: "#fff",
                    },
                });
            }

            return prev.filter((i) => i.id !== id);
        });
    };

    const updateQty = (id: string, qty: number) => {
        if (qty <= 0) return removeFromCart(id);
        setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    };
    const clearCart = () => setCart([]);

    return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};
