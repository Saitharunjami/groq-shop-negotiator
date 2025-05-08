
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useProducts } from '@/context/ProductContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { categories } from '@/lib/mockData';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const Products = () => {
  const { products, filterProducts } = useProducts();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(queryParams.get('category'));
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(queryParams.get('featured') === 'true');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Filtered products
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Text search filter
    if (searchQuery) {
      result = filterProducts(searchQuery, selectedCategory || undefined);
    } else if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Featured filter
    if (showFeaturedOnly) {
      result = result.filter(p => p.featured);
    }
    
    // Price range filter
    if (priceRange.min) {
      result = result.filter(p => p.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(p => p.price <= Number(priceRange.max));
    }
    
    // Sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, sortOption, showFeaturedOnly, priceRange, filterProducts]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Nothing needed here as the effect will handle filtering
  };

  // Handle price range change
  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortOption('featured');
    setPriceRange({ min: '', max: '' });
    setShowFeaturedOnly(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Products</h1>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 md:hidden"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <Filter size={18} />
              Filters
              {mobileFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="w-full md:w-64 space-y-6 hidden md:block">
            <div>
              <h3 className="font-medium mb-4">Categories</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Checkbox 
                    id="all-categories"
                    checked={!selectedCategory}
                    onCheckedChange={() => setSelectedCategory(null)}
                  />
                  <Label htmlFor="all-categories" className="ml-2">All Categories</Label>
                </div>
                
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <Checkbox 
                      id={category}
                      checked={selectedCategory === category}
                      onCheckedChange={() => setSelectedCategory(prev => prev === category ? null : category)}
                    />
                    <Label htmlFor={category} className="ml-2">{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={e => handlePriceRangeChange('min', e.target.value)}
                  className="w-full"
                />
                <span>to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={e => handlePriceRangeChange('max', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-4">Featured Items</h3>
              <div className="flex items-center">
                <Checkbox 
                  id="featured"
                  checked={showFeaturedOnly}
                  onCheckedChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
                />
                <Label htmlFor="featured" className="ml-2">Show featured only</Label>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>

          {/* Filters - Mobile */}
          {mobileFiltersOpen && (
            <div className="w-full mb-6 md:hidden space-y-6 bg-white p-4 rounded-lg shadow-sm">
              <div>
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <Checkbox 
                      id="mob-all-categories"
                      checked={!selectedCategory}
                      onCheckedChange={() => setSelectedCategory(null)}
                    />
                    <Label htmlFor="mob-all-categories" className="ml-2">All Categories</Label>
                  </div>
                  
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <Checkbox 
                        id={`mob-${category}`}
                        checked={selectedCategory === category}
                        onCheckedChange={() => setSelectedCategory(prev => prev === category ? null : category)}
                      />
                      <Label htmlFor={`mob-${category}`} className="ml-2">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-4">Price Range</h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={e => handlePriceRangeChange('min', e.target.value)}
                    className="w-full"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={e => handlePriceRangeChange('max', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-4">Featured Items</h3>
                <div className="flex items-center">
                  <Checkbox 
                    id="mob-featured"
                    checked={showFeaturedOnly}
                    onCheckedChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  />
                  <Label htmlFor="mob-featured" className="ml-2">Show featured only</Label>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          )}

          {/* Product List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
              
              <Select
                value={sortOption}
                onValueChange={setSortOption}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try changing your filters or search term</p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Link to={`/products/${product.id}`}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        {product.featured && <Badge className="bg-accent">Featured</Badge>}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/products/${product.id}`} className="w-full">
                        <Button className="w-full">View Product</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
