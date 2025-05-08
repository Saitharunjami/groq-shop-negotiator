
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Package, ShoppingBag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  negotiated_price: number | null;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items?: OrderItem[];
}

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      // Fetch all orders for the user
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      setOrders(ordersData || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
      setIsLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(name, image)
        `)
        .eq('order_id', orderId);
      
      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, items: data as OrderItem[] } 
          : order
      ));
      setExpandedOrder(orderId);
    } catch (error) {
      console.error('Error fetching order items:', error);
      toast.error('Failed to load order details');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500'; // pending
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center min-h-[50vh]">
          <p className="text-lg">Loading your orders...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>
        
        {orders.length === 0 ? (
          <Card className="text-center p-8">
            <div className="flex flex-col items-center gap-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No Orders Yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total Amount</div>
                      <div className="text-lg font-semibold">${order.total.toFixed(2)}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="p-4 border-b flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => fetchOrderItems(order.id)}
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                  
                  {expandedOrder === order.id && order.items && (
                    <div className="p-4">
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.items.map((item) => {
                              const finalPrice = item.negotiated_price || item.price;
                              const total = finalPrice * item.quantity;
                              
                              return (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                                        {item.product?.image ? (
                                          <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                                        ) : (
                                          <Package className="h-5 w-5 text-muted-foreground" />
                                        )}
                                      </div>
                                      <span className="font-medium">{item.product?.name || 'Product'}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>
                                    ${finalPrice.toFixed(2)}
                                    {item.negotiated_price && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        Negotiated
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>${total.toFixed(2)}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderHistory;
