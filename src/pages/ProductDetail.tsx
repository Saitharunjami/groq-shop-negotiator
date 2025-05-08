
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  MessageCircle, 
  ArrowLeft, 
  Minus, 
  Plus,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import BargainingChat from '@/components/BargainingChat';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProducts();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(id ? getProduct(id) : undefined);
  const [quantity, setQuantity] = useState(1);
  const [isBargaining, setIsBargaining] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState<number | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      const productData = getProduct(id);
      if (!productData) {
        // Product not found, redirect to products page
        navigate('/products');
        toast.error('Product not found');
      } else {
        setProduct(productData);
      }
    }
  }, [id, getProduct, navigate]);

  if (!product) {
    return null; // This will be replaced with redirect from useEffect
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.warning(`Sorry, only ${product.stock} items available`);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    setTimeout(() => {
      addItem(product, quantity, negotiatedPrice || undefined);
      setIsAddingToCart(false);
      setQuantity(1);
      setNegotiatedPrice(null);
    }, 500); // Simulating a short delay for UX
  };

  const handlePriceAccepted = (price: number) => {
    setNegotiatedPrice(price);
    toast.success(`Great! You negotiated a price of $${price.toFixed(2)}`);
  };

  const startBargaining = () => {
    if (!user) {
      toast.error('Please sign in to negotiate prices');
      navigate('/login');
      return;
    }
    setIsBargaining(true);
  };

  const finalPrice = negotiatedPrice || product.price;
  const discount = negotiatedPrice 
    ? ((product.price - negotiatedPrice) / product.price * 100).toFixed(0)
    : product.originalPrice
      ? ((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0)
      : null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden bg-white p-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto object-contain max-h-96"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.featured && <Badge className="bg-accent">Featured</Badge>}
              </div>
              <p className="text-gray-500 mb-4">{product.category}</p>
              
              <div className="flex items-baseline gap-3 mb-4">
                {negotiatedPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${negotiatedPrice.toFixed(2)}</span>
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" /> Negotiated
                    </Badge>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                )}
                
                {product.originalPrice && !negotiatedPrice && (
                  <span className="text-gray-400 line-through text-lg">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                
                {discount && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="font-semibold text-lg mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Availability */}
            <div>
              <p className="text-sm text-gray-600">
                Availability: 
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'} style={{ marginLeft: '0.5rem' }}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </p>
            </div>
            
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAddingToCart}
                className="flex-1"
              >
                {isAddingToCart ? (
                  "Adding..."
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={startBargaining}
                className="flex-1"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Negotiate Price
              </Button>
            </div>
          </div>
        </div>
        
        {/* Additional Product Information - Can be expanded in future */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Category</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Stock</span>
                    <span>{product.stock} units</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Product ID</span>
                    <span>{product.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Free Shipping</h4>
                    <p className="text-gray-600 text-sm">
                      On orders over $50. Standard delivery 3-5 business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Easy Returns</h4>
                    <p className="text-gray-600 text-sm">
                      Return within 30 days of purchase. See our return policy for details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Bargaining Dialog */}
      <Dialog open={isBargaining} onOpenChange={setIsBargaining}>
        <DialogContent className="sm:max-w-[500px] p-0">
          <BargainingChat 
            product={product}
            onClose={() => setIsBargaining(false)}
            onPriceAccepted={handlePriceAccepted}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ProductDetail;
