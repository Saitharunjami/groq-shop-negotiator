
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Image as ImageIcon, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Product, Recommendation } from '@/lib/types';

const Recommendations = () => {
  const { products } = useProducts();
  const { user } = useAuth();
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle image drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Prevent default behavior for drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Handle get recommendations
  const handleGetRecommendations = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would send the image to an AI service
    // For demo, we'll simulate a response with random products
    setTimeout(() => {
      // Get random products as recommendations
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);
      
      // Generate recommendations with scores and reasons
      const generatedRecommendations = selected.map(product => ({
        productId: product.id,
        score: Math.random() * 0.5 + 0.5, // Random score between 0.5 and 1
        reason: getRandomReason(product)
      }));
      
      setRecommendations(generatedRecommendations);
      setRecommendedProducts(selected);
      setIsLoading(false);
      
      toast.success('Recommendations generated based on your image!');
    }, 2000);
  };
  
  // Random reasons for recommendations
  const getRandomReason = (product: Product) => {
    const reasons = [
      `This ${product.category.toLowerCase()} matches the style in your image.`,
      `The color and design of this ${product.name.toLowerCase()} complement your uploaded item.`,
      `Based on the image, we think this ${product.category.toLowerCase()} would be a great addition to your collection.`,
      `This product shares similar features with the item in your uploaded image.`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Smart Recommendations</h1>
        <p className="text-gray-600 mb-6">Upload an image and get personalized product recommendations</p>
        
        <Tabs defaultValue="upload">
          <TabsList className="mb-6">
            <TabsTrigger value="upload" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center" disabled={recommendedProducts.length === 0}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Recommendations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card>
                <CardContent className="pt-6">
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center bg-gray-50"
                    style={{ minHeight: '320px' }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded preview" 
                          className="max-h-60 max-w-full mx-auto rounded-lg" 
                        />
                        <Button variant="outline" onClick={() => setUploadedImage(null)}>
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-gray-100 rounded-full p-4 mb-4">
                          <ImageIcon size={48} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Drag & Drop Image</h3>
                        <p className="text-gray-500 mb-4">or click to browse files</p>
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <div className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition">
                            Select Image
                          </div>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </Label>
                      </>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={!uploadedImage || isLoading} 
                    onClick={handleGetRecommendations}
                  >
                    {isLoading ? "Analyzing image..." : "Get Recommendations"}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Instructions */}
              <div>
                <h2 className="text-xl font-semibold mb-4">How It Works</h2>
                <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-2 text-primary">
                      <span className="font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Upload an Image</h3>
                      <p className="text-sm text-gray-600">
                        Upload any image of a product, outfit, or style you're interested in.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-2 text-primary">
                      <span className="font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Advanced Analysis</h3>
                      <p className="text-sm text-gray-600">
                        Our AI analyzes the image to understand colors, patterns, styles, and objects.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-2 text-primary">
                      <span className="font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Get Recommendations</h3>
                      <p className="text-sm text-gray-600">
                        Receive personalized product recommendations based on your image.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                <h3 className="text-xl font-medium">Analyzing your image</h3>
                <p className="text-gray-500">Finding the perfect recommendations for you...</p>
              </div>
            ) : recommendedProducts.length > 0 ? (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-semibold">Based on your image</h2>
                    <img 
                      src={uploadedImage!} 
                      alt="Uploaded" 
                      className="h-12 w-12 object-cover rounded-md border"
                    />
                  </div>
                  
                  <div className="product-grid">
                    {recommendedProducts.map((product, index) => {
                      const recommendation = recommendations.find(r => r.productId === product.id);
                      return (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <Link to={`/products/${product.id}`}>
                            <img 
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover"
                            />
                          </Link>
                          <CardContent className="pt-4">
                            <h3 className="font-semibold truncate mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="text-gray-400 line-through text-sm">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {recommendation && (
                              <div className="mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1 text-green-600 mb-1">
                                  <span>Match score:</span>
                                  <div className="bg-gray-200 w-24 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-green-500 h-full rounded-full"
                                      style={{ width: `${recommendation.score * 100}%` }}
                                    />
                                  </div>
                                  <span>{Math.round(recommendation.score * 100)}%</span>
                                </div>
                                <p>{recommendation.reason}</p>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="flex gap-2">
                            <Link to={`/products/${product.id}`} className="flex-1">
                              <Button variant="outline" className="w-full">View Details</Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h2 className="text-xl font-semibold mb-6">You might also like</h2>
                  <div className="product-grid">
                    {products.filter(p => !recommendedProducts.some(rp => rp.id === p.id))
                      .slice(0, 4)
                      .map(product => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <Link to={`/products/${product.id}`}>
                            <img 
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover"
                            />
                          </Link>
                          <CardContent className="pt-4">
                            <h3 className="font-semibold truncate">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="text-gray-400 line-through text-sm">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Link to={`/products/${product.id}`} className="w-full">
                              <Button variant="outline" className="w-full">View Details</Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No recommendations yet</h3>
                <p className="text-gray-500 mb-4">Upload an image to get personalized recommendations</p>
                <Button onClick={() => {
                  const tabTriggers = document.querySelectorAll('[role="tab"]');
                  if (tabTriggers.length > 0) {
                    (tabTriggers[0] as HTMLElement).click();
                  }
                }}>
                  Upload Image
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Recommendations;
