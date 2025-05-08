
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/context/ProductContext';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ShoppingCart, Star } from 'lucide-react';

const Index = () => {
  const { products } = useProducts();
  
  // Get featured products
  const featuredProducts = products.filter(product => product.featured).slice(0, 4);
  
  // Get recent products
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Shop Smart, Negotiate Better
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            The only e-commerce platform where you can negotiate prices directly with our AI assistant.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Shop Now
              </Button>
            </Link>
            <Link to="/recommendations">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Get Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Shop With Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Negotiation</h3>
              <p className="text-gray-600">Negotiate prices in real-time with our AI assistant to get the best deals.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Recommendations</h3>
              <p className="text-gray-600">Upload an image and get personalized product recommendations instantly.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Shopping</h3>
              <p className="text-gray-600">Enjoy a smooth shopping experience from browsing to checkout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products?featured=true" className="text-primary hover:underline">View all</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/products/${product.id}`}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <Badge className="bg-accent">Featured</Badge>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/products/${product.id}`} className="w-full">
                  <Button className="w-full">View Product</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-16 container mx-auto px-4 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <Link to="/products?sort=newest" className="text-primary hover:underline">View all</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/products/${product.id}`}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <CardContent className="pt-4">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/products/${product.id}`} className="w-full">
                  <Button className="w-full">View Product</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
