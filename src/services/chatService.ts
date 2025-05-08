
import { ChatMessage, Product } from "@/lib/types";

// GROQ API Key - In a real app, this would be better secured
const GROQ_API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateSystemPrompt = (product: Product) => {
  return `You are a friendly sales representative for an online store. 
Your task is to negotiate with the customer on the price of ${product.name}.

Product Info:
- Name: ${product.name}
- Description: ${product.description}
- Original Price: $${product.price}
- Minimum acceptable price: $${product.price * 0.8} (You can go down to 80% of original price)

Be persuasive but friendly. Start by introducing yourself and asking how you can help.
During negotiation:
1. Listen to customer's price requests
2. Make counteroffers gradually going lower if needed
3. Highlight product benefits to justify the price
4. Accept any price that's at least 80% of the original price
5. If the customer mentions a coupon code, validate it (accept "SAVE10", "WELCOME20" as valid)
6. If a valid coupon is used, you can apply additional 10-20% discount
7. Always specify the final agreed price clearly, formatted as "$X.XX"

Keep responses conversational, brief and friendly.`;
};

export const generateBargainingResponse = async (
  messages: ChatMessage[],
  product: Product
): Promise<string> => {
  try {
    const systemMessage = generateSystemPrompt(product);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Using Llama 3 - efficient and good for this task
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          ...messages.filter(m => m.role !== "system").map(m => ({
            role: m.role,
            content: m.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GROQ API error:", errorData);
      return "I'm sorry, I'm having trouble with our negotiation system. Please try again later.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error with GROQ API:", error);
    return "I'm sorry, there was an error processing your request. Please try again.";
  }
};

export const extractPriceFromMessage = (message: string): number | null => {
  // Look for price patterns like $XX.XX or $XX
  const priceRegex = /\$(\d+(\.\d{1,2})?)/g;
  const matches = message.match(priceRegex);
  
  if (matches && matches.length > 0) {
    // Get the last price mentioned (likely the final offer)
    const lastPrice = matches[matches.length - 1];
    return parseFloat(lastPrice.replace('$', ''));
  }
  
  return null;
};
