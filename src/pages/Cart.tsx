
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, Trash, Plus, Minus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handleQuantityChange = (productId: string, delta: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, name: string) => {
    removeItem(productId);
  };

  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true);
    
    // Simulated coupon validation
    setTimeout(() => {
      const validCoupons = {
        'SAVE10': 10,
        'WELCOME20': 20
      };
      
      if (couponCode.trim().toUpperCase() in validCoupons) {
        const discountPercent = validCoupons[couponCode.trim().toUpperCase() as keyof typeof validCoupons];
        const discountAmount = (totalPrice * discountPercent) / 100;
        setDiscount(discountAmount);
        toast.success(`Coupon applied! ${discountPercent}% off your order.`);
      } else {
        toast.error('Invalid coupon code.');
        setDiscount(0);
      }
      
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.warning('Please sign in to checkout');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Link to="/products" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <ShoppingCart size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products">
              <Button className="bg-primary">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-xl">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {items.map((item) => (
                    <div key={item.productId} className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-b-0">
                      {/* Product Image */}
                      <div className="w-full sm:w-32">
                        <Link to={`/products/${item.productId}`}>
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        </Link>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <Link 
                            to={`/products/${item.productId}`} 
                            className="font-medium hover:text-primary"
                          >
                            {item.product.name}
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveItem(item.productId, item.product.name)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-3">{item.product.category}</p>
                        
                        {item.negotiatedPrice && (
                          <p className="text-sm text-green-600 mb-2">
                            Negotiated price: ${item.negotiatedPrice.toFixed(2)}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap justify-between items-center gap-2 mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() => handleQuantityChange(item.productId, -1, item.quantity)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </Button>
                            <span className="w-10 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() => handleQuantityChange(item.productId, 1, item.quantity)}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium">
                              ${((item.negotiatedPrice || item.product.price) * item.quantity).toFixed(2)}
                            </div>
                            {(item.negotiatedPrice || item.product.originalPrice) && (
                              <div className="text-sm text-gray-500 line-through">
                                ${((item.product.originalPrice || item.product.price) * item.quantity).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => clearCart()}>
                    Clear Cart
                  </Button>
                  <Link to="/products">
                    <Button variant="ghost">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(totalPrice - discount).toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-2">
                    <label htmlFor="coupon" className="block text-sm font-medium mb-1">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        placeholder="Enter coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button 
                        onClick={handleApplyCoupon}
                        disabled={!couponCode || isApplyingCoupon}
                        variant="outline"
                      >
                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </CardContent>
              </Card>
              
              {!user && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 mb-1">Sign in to continue</h3>
                    <p className="text-sm text-amber-700">
                      Please <Link to="/login" className="underline font-medium">sign in</Link> to your account to proceed with checkout.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
