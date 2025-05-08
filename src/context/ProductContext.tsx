
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { products as initialProducts } from '@/lib/mockData';
import { toast } from 'sonner';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  filterProducts: (query: string, category?: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const storedProducts = localStorage.getItem('ecomm-products');
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (error) {
        console.error('Error parsing stored products:', error);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('ecomm-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setProducts(currentProducts => [...currentProducts, newProduct]);
    toast.success(`Added new product: ${product.name}`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(currentProducts => 
      currentProducts.map(product => 
        product.id === id 
          ? { ...product, ...updates } 
          : product
      )
    );
    toast.success(`Updated product: ${updates.name || id}`);
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    setProducts(currentProducts => currentProducts.filter(product => product.id !== id));
    if (productToDelete) {
      toast.success(`Deleted product: ${productToDelete.name}`);
    }
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const filterProducts = (query: string, category?: string) => {
    const searchTerm = query.toLowerCase();
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !category || product.category === category;
      
      return matchesSearch && matchesCategory;
    });
  };

  const value = {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    filterProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
