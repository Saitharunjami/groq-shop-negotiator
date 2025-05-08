
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  Home, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is admin
  React.useEffect(() => {
    if (!user || !isAdmin) {
      toast.error('You do not have permission to access this page');
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : '';
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/products', label: 'Products', icon: <ShoppingBag size={20} /> },
    { path: '/admin/users', label: 'Customers', icon: <Users size={20} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed inset-y-0 z-20 hidden md:flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-white transition-colors">
            <Package size={24} />
            <span className="font-bold text-xl">ShopSmart</span>
          </Link>
        </div>
        
        <div className="p-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2 mb-8">
            <div className="font-medium">Admin Dashboard</div>
          </Link>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${isActive(item.path)} hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-sidebar-foreground/70">{user?.email}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Home size={16} className="mr-1" />
                Store
              </Button>
            </Link>
            <Button variant="outline" size="icon" onClick={() => logout()}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-10 bg-sidebar text-sidebar-foreground h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <Package size={20} />
          <span className="font-bold">ShopSmart Admin</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Home size={16} />
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => logout()}>
            <LogOut size={16} />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-10 bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
        <div className="grid grid-cols-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-3 ${
                location.pathname.startsWith(item.path) 
                  ? 'text-sidebar-accent' 
                  : 'text-sidebar-foreground'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
