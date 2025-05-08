
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/lib/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, negotiatedPrice?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  setNegotiatedPrice: (productId: string, price: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from local storage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem(`ecomm-cart-${user?.id || 'guest'}`);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }, [user?.id]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(`ecomm-cart-${user?.id || 'guest'}`, JSON.stringify(items));
    }
  }, [items, user?.id]);

  const addItem = (product: Product, quantity = 1, negotiatedPrice?: number) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        const updatedItems = currentItems.map(item => 
          item.productId === product.id
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                negotiatedPrice: negotiatedPrice || item.negotiatedPrice
              }
            : item
        );
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      } else {
        toast.success(`Added ${product.name} to cart`);
        return [
          ...currentItems, 
          { 
            productId: product.id, 
            quantity, 
            product,
            negotiatedPrice 
          }
        ];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.productId === productId);
      if (itemToRemove) {
        toast.info(`Removed ${itemToRemove.product.name} from cart`);
      }
      return currentItems.filter(item => item.productId !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    setItems(currentItems => 
      currentItems.map(item => 
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const setNegotiatedPrice = (productId: string, price: number) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.productId === productId
          ? { ...item, negotiatedPrice: price }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(`ecomm-cart-${user?.id || 'guest'}`);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce((total, item) => {
    const itemPrice = item.negotiatedPrice || item.product.price;
    return total + (itemPrice * item.quantity);
  }, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    setNegotiatedPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
