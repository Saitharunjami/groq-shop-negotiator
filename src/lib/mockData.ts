
import { Product, User } from "./types";

// Sample users data
export const users: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "customer-1",
    name: "John Customer",
    email: "customer@example.com",
    role: "customer",
  },
];

// Sample products data
export const products: Product[] = [
  {
    id: "prod-1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation technology.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Electronics",
    stock: 45,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Smart Fitness Tracker",
    description: "Track your fitness goals with heart rate monitoring and GPS.",
    price: 129.99,
    originalPrice: 149.99,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZpdG5lc3MlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Fitness",
    stock: 78,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Designer Sunglasses",
    description: "Fashionable sunglasses with UV protection.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Fashion",
    stock: 120,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Coffee Maker",
    description: "Programmable coffee maker with built-in grinder.",
    price: 149.99,
    originalPrice: 179.99,
    image: "https://images.unsplash.com/photo-1520608760-eff2c38b0515?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29mZmVlJTIwbWFrZXJ8ZW58MHx8MHx8fDA%3D",
    category: "Home",
    stock: 32,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Smartphone Stand",
    description: "Adjustable stand for smartphones and tablets.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBob25lJTIwc3RhbmR8ZW58MHx8MHx8fDA%3D",
    category: "Accessories",
    stock: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-6",
    name: "Wireless Gaming Mouse",
    description: "Precision wireless mouse for gaming enthusiasts.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z2FtaW5nJTIwbW91c2V8ZW58MHx8MHx8fDA%3D",
    category: "Gaming",
    stock: 65,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-7",
    name: "Leather Wallet",
    description: "Genuine leather wallet with RFID protection.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVhdGhlciUyMHdhbGxldHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Fashion",
    stock: 110,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-8",
    name: "Smart Indoor Plant Pot",
    description: "Self-watering pot with soil moisture monitoring.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNtYXJ0JTIwcGxhbnQlMjBwb3R8ZW58MHx8MHx8fDA%3D",
    category: "Home",
    stock: 48,
    createdAt: new Date().toISOString(),
  },
];

export const categories = [...new Set(products.map(product => product.category))];
