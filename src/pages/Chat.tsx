
import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, Bot, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';

// GROQ API Key - In a real app, this would be better secured
const GROQ_API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const Chat: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { products } = useProducts();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history when component mounts
  useEffect(() => {
    if (user) {
      fetchChatHistory();
    } else {
      setIsFetchingHistory(false);
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setMessages(data as ChatMessage[]);
      } else {
        // Add welcome message if no history
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! I\'m your shopping assistant. I can help you find products, negotiate prices, and answer questions about our store. How can I assist you today?',
          timestamp: new Date().toISOString(),
          user_id: user?.id,
        };
        setMessages([welcomeMessage]);
        await saveMessageToDb(welcomeMessage);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const saveMessageToDb = async (message: ChatMessage) => {
    if (!user) return;

    try {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role: message.role,
        content: message.content,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    if (!user) {
      toast.error('Please sign in to use the chat');
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      user_id: user.id,
    };

    // Update UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Save user message to DB
    await saveMessageToDb(userMessage);

    try {
      // Generate system prompt with product info
      const productsList = products.map(p => 
        `- ${p.name}: $${p.price} (ID: ${p.id}, Stock: ${p.stock}, Category: ${p.category})`
      ).join('\\n');

      const systemMessage = `You are a helpful shopping assistant for our e-commerce store named ShopSmart. 
You help customers find products, negotiate prices (you can discount up to 20%), and provide excellent customer service.
Here's our current product listing:
${productsList}

You can recommend products based on customer preferences, help them find items by category, or suggest similar products.
If a customer wants to negotiate a price, you can offer discounts of up to 20% off the listed price. 
Be friendly, helpful, and conversational. If you don't know something, politely say so.`;
      
      // Get all previous messages, excluding the "id", "timestamp", and "user_id" fields
      const historyMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemMessage },
            ...historyMessages,
            { role: 'user', content: inputMessage }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botResponse,
        timestamp: new Date().toISOString(),
        user_id: user.id,
      };

      // Update UI with bot response
      setMessages(prev => [...prev, botMessage]);

      // Save bot message to DB
      await saveMessageToDb(botMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get response');

      // Add error message
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date().toISOString(),
        user_id: user.id,
      };
      setMessages(prev => [...prev, errorMsg]);
      await saveMessageToDb(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isFetchingHistory) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
          <p>Loading chat...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>ShopSmart Assistant</CardTitle>
            <CardDescription>
              Chat with our AI assistant to find products, negotiate prices, or get help with your shopping.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 mb-6 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className={message.role === 'user' ? 'bg-primary' : 'bg-secondary'}>
                    {message.role === 'assistant' ? (
                      <Bot className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Avatar>
                  <div
                    className={`px-4 py-3 rounded-lg max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3 mb-6">
                  <Avatar className="bg-secondary">
                    <Bot className="h-5 w-5" />
                  </Avatar>
                  <div className="px-4 py-3 rounded-lg bg-muted">
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
          
          <CardFooter>
            <form onSubmit={handleSendMessage} className="w-full flex gap-2">
              <Input
                placeholder={user ? "Type your message..." : "Please sign in to chat"}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading || !user}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !inputMessage.trim() || !user}>
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Chat;
