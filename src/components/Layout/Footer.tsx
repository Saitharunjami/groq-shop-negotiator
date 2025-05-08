
import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Package size={24} />
              <span className="text-xl font-bold">ShopSmart</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for amazing products with the ability to negotiate prices.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white transition">All Products</Link></li>
              <li><Link to="/products?featured=true" className="text-gray-400 hover:text-white transition">Featured Products</Link></li>
              <li><Link to="/recommendations" className="text-gray-400 hover:text-white transition">Recommendations</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-400 hover:text-white transition">Sign In</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition">Register</Link></li>
              <li><Link to="/account" className="text-gray-400 hover:text-white transition">My Account</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white transition">View Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-400">
              <p>123 E-Commerce St.</p>
              <p>Shopping City, SC 12345</p>
              <p className="mt-2">Email: support@shopsmart.com</p>
              <p>Phone: (555) 123-4567</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} ShopSmart. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
