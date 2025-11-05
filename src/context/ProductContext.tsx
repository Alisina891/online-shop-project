"use client";

import { createContext, useState } from "react";

type Product = {
  id?: number;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
};

type ProductContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const ProductContext = createContext<ProductContextType>({
  products: [],
  setProducts: () => {},
});

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
