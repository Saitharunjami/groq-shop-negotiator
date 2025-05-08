
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, Bot, User, X } from 'lucide-react';
import { ChatMessage, Product } from '@/lib/types';
import { generateBargainingResponse, extractPriceFromMessage } from '@/services/chatService';
import { useCart } from '@/context/CartContext';

interface BargainingChatProps {
  product: Product;
  onClose: () => void;
  onPriceAccepted: (price: number) => void;
}

const BargainingChat: React.FC<BargainingChatProps> = ({ 
  product, 
  onClose,
  onPriceAccepted
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial message when component mounts
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hi there! I'm your sales assistant for the ${product.name}. The listed price is $${product.price.toFixed(2)}, but I might be able to offer you a better deal. What price did you have in mind?`,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([initialMessage]);
  }, [product]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Get AI response
      const response = await generateBargainingResponse([...messages, userMessage], product);
      
      // Check if the response contains a price agreement
      const agreedPrice = extractPriceFromMessage(response);
      
      // Add AI message
      const assistantMessage: ChatMessage = {
        id: `response-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // If price agreement detected, notify parent component
      if (agreedPrice && agreedPrice <= product.price) {
        onPriceAccepted(agreedPrice);
      }
    } catch (error) {
      console.error('Error generating chat response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an issue. Please try again.',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Negotiate Price</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-[360px] p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 mb-4 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar>
                {message.role === 'assistant' ? (
                  <Bot size={24} />
                ) : (
                  <User size={24} />
                )}
              </Avatar>
              
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3 mb-4">
              <Avatar>
                <Bot size={24} />
              </Avatar>
              <div className="px-4 py-2 rounded-lg bg-muted">
                <div className="flex gap-1">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-grow"
          />
          <Button type="submit" disabled={!input.trim() || isTyping}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default BargainingChat;
