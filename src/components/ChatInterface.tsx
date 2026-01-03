import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApiRecipe } from "@/pages/Dashboard";
import { useAuth } from "@/context/AuthContext";

interface ChatInterfaceProps {
    recipe: ApiRecipe;
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const ChatInterface = ({ recipe }: ChatInterfaceProps) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: `Hello! I'm your AI Chef. I can help you with the **${recipe.recipeName}** recipe. Ask me about substitutions, steps, or tips!`,
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom directly manipulating the scroll area viewport if possible, 
    // or using a dummy div at the bottom
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://localhost:5001/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    recipeId: recipe.id,
                    // Sending context just in case the backend is stateless/simple for now
                    // ideally backend fetches recipe from DB using ID
                    recipeContext: {
                        name: recipe.recipeName,
                        ingredients: [...recipe.ingredients.providedIngredient, ...recipe.ingredients.additionalIngredient],
                        instructions: recipe.instructions
                    }
                }),
            });

            const responseData = await response.json();

            if (!response.ok || !responseData.success) {
                throw new Error(responseData.error || "Failed to get response");
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responseData.data.response || responseData.data || "I'm sorry, I couldn't process that. Please try again.", // Handle if data IS the string or object
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);

        } catch (error) {
            console.error("Chat error:", error);
            // Fallback/Mock response for demo purposes if backend isn't ready
            // REMOVE THIS IN PRODUCTION if backend is guaranteed
            const mockResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm having trouble connecting to the server seamlessly right now. However, for this recipe, verify you have all ingredients prepped!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, mockResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[500px] w-full">
            <ScrollArea className="flex-1 pr-4 p-4 border rounded-md mb-4 bg-muted/30">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            <Avatar className="w-8 h-8 mt-1">
                                {msg.role === "assistant" ? (
                                    <div className="bg-gradient-hero w-full h-full flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                ) : (
                                    <AvatarFallback className="bg-primary/20 text-primary">
                                        <User className="w-4 h-4" />
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div
                                className={`rounded-lg p-3 max-w-[80%] text-sm ${msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-white dark:bg-card border shadow-sm"
                                    }`}
                            >
                                {/* Simple Markdown rendering support could go here */}
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <Avatar className="w-8 h-8 mt-1">
                                <div className="bg-gradient-hero w-full h-full flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            </Avatar>
                            <div className="bg-white dark:bg-card border shadow-sm rounded-lg p-3">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            <div className="flex gap-2">
                <Input
                    placeholder="Ask about this recipe..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                    disabled={isLoading}
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    size="icon"
                    className="bg-gradient-hero"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );
};

export default ChatInterface;
