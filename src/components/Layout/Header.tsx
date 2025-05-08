
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  User, 
  LogOut,
  Search,
  Menu,
  X,
  Package,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-primary text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Package size={28} />
          <span className="hidden sm:inline">ShopSmart</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
          {user && <Link to="/recommendations" className="hover:text-accent transition-colors">Recommendations</Link>}
          {user && <Link to="/chat" className="hover:text-accent transition-colors">Chat</Link>}
          {isAdmin && <Link to="/admin/dashboard" className="hover:text-accent transition-colors">Admin Dashboard</Link>}
        </div>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-4 max-w-md">
          <div className="relative w-full">
            <Input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 text-black"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
        </form>

        {/* User Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/chat" className="text-white hover:text-accent transition-colors">
            <MessageSquare size={24} />
          </Link>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-white rounded-full h-5 w-5 flex items-center justify-center p-0">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/account">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">{user.email}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => logout()}>
                <LogOut />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="bg-white text-primary hover:bg-gray-100">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Cart Button */}
        <Link to="/cart" className="md:hidden">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-accent text-white rounded-full h-5 w-5 flex items-center justify-center p-0">
                {totalItems}
              </Badge>
            )}
          </Button>
        </Link>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-700 mt-4 py-4">
          <div className="container mx-auto flex flex-col space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex">
              <div className="relative w-full">
                <Input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 text-black"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </form>
            
            {/* Mobile Nav Links */}
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent">Products</Link>
            {user && <Link to="/recommendations" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent">Recommendations</Link>}
            {user && <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent">Chat</Link>}
            {isAdmin && <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent">Admin Dashboard</Link>}
            
            {/* User Actions */}
            {user ? (
              <>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="py-2 flex items-center gap-2">
                  <User size={18} />
                  <span>{user.email}</span>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full flex justify-center items-center gap-2 bg-white text-primary"
                >
                  <LogOut size={18} />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="outline" className="w-full bg-white text-primary">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
