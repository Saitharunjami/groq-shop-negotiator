
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  filterProducts: (query: string, category?: string) => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform to match our Product type
      const transformedProducts: Product[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        image: item.image || '/placeholder.svg',
        category: item.category || 'Uncategorized',
        stock: item.stock || 0,
        featured: item.featured || false,
        createdAt: item.created_at,
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase.from('products').insert({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        image: product.image,
        category: product.category,
        stock: product.stock,
        featured: product.featured || false,
      }).select().single();

      if (error) {
        throw error;
      }

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        image: data.image || '/placeholder.svg',
        category: data.category || 'Uncategorized',
        stock: data.stock || 0,
        featured: data.featured || false,
        createdAt: data.created_at,
      };

      setProducts(currentProducts => [newProduct, ...currentProducts]);
      toast.success(`Added new product: ${product.name}`);
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(`Failed to add product: ${error.message}`);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      // Convert to snake_case for Supabase
      const supabaseUpdates: any = {};
      if ('name' in updates) supabaseUpdates.name = updates.name;
      if ('description' in updates) supabaseUpdates.description = updates.description;
      if ('price' in updates) supabaseUpdates.price = updates.price;
      if ('originalPrice' in updates) supabaseUpdates.original_price = updates.originalPrice;
      if ('image' in updates) supabaseUpdates.image = updates.image;
      if ('category' in updates) supabaseUpdates.category = updates.category;
      if ('stock' in updates) supabaseUpdates.stock = updates.stock;
      if ('featured' in updates) supabaseUpdates.featured = updates.featured;

      const { error } = await supabase
        .from('products')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(currentProducts =>
        currentProducts.map(product =>
          product.id === id
            ? { ...product, ...updates }
            : product
        )
      );
      toast.success(`Updated product: ${updates.name || id}`);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(`Failed to update product: ${error.message}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const productToDelete = products.find(p => p.id === id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(currentProducts => currentProducts.filter(product => product.id !== id));
      
      if (productToDelete) {
        toast.success(`Deleted product: ${productToDelete.name}`);
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(`Failed to delete product: ${error.message}`);
    }
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const filterProducts = (query: string, category?: string) => {
    const searchTerm = query.toLowerCase();
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !category || product.category === category;
      
      return matchesSearch && matchesCategory;
    });
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const value = {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    filterProducts,
    refreshProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
