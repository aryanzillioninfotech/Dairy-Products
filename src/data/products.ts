export type Product = {
  id: string;
  title: string;
  price: number;
  img?: string;
  desc?: string;
};

export const products: Product[] = [
  { id: "p1", title: "Fresh Cow Milk (1L)", price: 50, img: "/images/product-image-5-300x300.jpg", desc: "Farm fresh whole milk." },
  { id: "p2", title: "Paneer (200g)", price: 120, img: "/images/product-image-3-300x300.jpg", desc: "Soft homemade paneer." },
  { id: "p3", title: "White Butter (250g)", price: 95, img: "/images/product-image-6-300x300.jpg", desc: "Creamy churned butter." },
  { id: "p4", title: "Ghee (250g)", price: 240, img: "/images/product-image-4-300x300.jpg", desc: "Aromatic desi ghee." },
  { id: "p5", title: "Flavored Yogurt (200g)", price: 40, img: "/images/image.png", desc: "Strawberry yogurt." },
  { id: "p6", title: "Cheese Slice (pack)", price: 180, img: "/images/product-image-2-300x300.jpg", desc: "Melty processed cheese." }
];
