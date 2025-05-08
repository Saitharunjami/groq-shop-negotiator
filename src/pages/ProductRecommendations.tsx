
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImagePlus, Loader2, Search, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/lib/types';

const ProductRecommendations = () => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setImageUrl(null);
      return;
    }
    
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Image uploaded successfully');
    }, 1500);
  };

  const findSimilarProducts = () => {
    if (!imageUrl) {
      toast.error('Please upload an image first');
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Get random selection of products as mock recommendations
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const sampleRecommendations = shuffled.slice(0, 4);
      
      setRecommendations(sampleRecommendations);
      setIsSearching(false);
      toast.success('Found similar products!');
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Visual Product Recommendations</h1>
        <p className="text-muted-foreground mb-8">
          Upload an image to find similar products in our store
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select a product image to find similar items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image">Product Image</Label>
                  <div className="mt-2">
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
                {imageUrl && (
                  <div className="aspect-square rounded-md overflow-hidden border bg-muted/20">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {!imageUrl && (
                  <div className="aspect-square rounded-md border border-dashed flex flex-col items-center justify-center p-4 text-center bg-muted/20">
                    <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Select an image to upload
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button 
                className="w-full" 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Image'
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={findSimilarProducts}
                disabled={!imageUrl || isSearching || isUploading}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Similar Products
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Products</CardTitle>
                <CardDescription>
                  Products that match your image
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSearching ? (
                  <div className="min-h-[400px] flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Looking for similar products...</p>
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendations.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.featured && (
                            <Badge className="absolute top-2 right-2 bg-primary">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">Similarity: 92%</span>
                            </div>
                            <div className="font-semibold">
                              ${product.price.toFixed(2)}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-0">
                          <Button 
                            variant="ghost" 
                            className="w-full rounded-none rounded-b-lg py-3 border-t"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="min-h-[400px] flex flex-col items-center justify-center">
                    <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground mb-2">No recommendations yet</p>
                    <p className="text-sm text-muted-foreground/70 text-center max-w-xs">
                      Upload an image and click "Find Similar Products" to see recommendations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductRecommendations;
