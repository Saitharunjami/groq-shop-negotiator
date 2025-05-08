
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/context/ProductContext';
import { DollarSign, ShoppingBag, Users, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { products } = useProducts();
  
  // Calculate metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((total, product) => total + product.stock, 0);
  const totalValue = products.reduce((total, product) => total + product.price * product.stock, 0);
  const lowStockItems = products.filter(product => product.stock < 10).length;
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(totalValue * 0.4).toLocaleString()}</div>
              <p className="text-xs text-gray-500">+15% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-gray-500">{lowStockItems} low stock items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-gray-500">+22 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-gray-500">+0.5% from last week</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity and Inventory Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Customer ordered {products[i % products.length]?.name}</p>
                      <p className="text-sm text-gray-500">{new Date(Date.now() - i * 3600000).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Total Items</span>
                  <span>{totalStock} units</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Total Value</span>
                  <span>${totalValue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Low Stock Items</span>
                  <span>{lowStockItems}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Out of Stock Items</span>
                  <span>{products.filter(p => p.stock === 0).length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Featured Products</span>
                  <span>{products.filter(p => p.featured).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
