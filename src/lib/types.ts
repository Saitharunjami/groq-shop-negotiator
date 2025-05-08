
export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
  negotiatedPrice?: number;
}

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};

export interface Recommendation {
  productId: string;
  score: number;
  reason: string;
}
