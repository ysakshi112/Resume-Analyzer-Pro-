
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Send, Bot, User, Lightbulb, Target, Star } from "lucide-react";

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const ChatBot = ({ isOpen, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your Resume Analysis Assistant. I can help you improve your resume, analyze skill gaps, and provide personalized suggestions. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "How can I improve my resume score?",
        "What skills are missing for Frontend roles?",
        "Analyze my project descriptions",
        "Compare my resume with industry standards"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(inputValue),
        timestamp: new Date(),
        suggestions: getBotSuggestions(inputValue)
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputValue("");
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('score') || lowerInput.includes('improve')) {
      return "Based on your resume analysis, here are key areas to improve your score: 1) Add more quantifiable achievements, 2) Include relevant keywords for your target role, 3) Ensure consistent formatting, 4) Add missing technical skills like React hooks or TypeScript.";
    }
    
    if (lowerInput.includes('skill') || lowerInput.includes('gap')) {
      return "Your skill gap analysis shows you're missing some key frontend skills: GraphQL (23% match), Next.js (34% match), and Testing frameworks (12% match). Consider taking online courses or building projects that demonstrate these skills.";
    }
    
    if (lowerInput.includes('project')) {
      return "Your project descriptions could be stronger. Try using the STAR method (Situation, Task, Action, Result). For example, instead of 'Built an e-commerce site', try 'Developed a full-stack e-commerce platform that increased user engagement by 40% using React and Node.js'.";
    }
    
    return "I'd be happy to help! Could you be more specific about what aspect of your resume you'd like to improve? I can analyze skills, projects, formatting, or provide general enhancement tips.";
  };

  const getBotSuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('score')) {
      return [
        "Show me specific examples to improve",
        "What's the ideal keyword density?",
        "How important is formatting?"
      ];
    }
    
    if (lowerInput.includes('skill')) {
      return [
        "Which skills are most in-demand?",
        "How do I learn these missing skills?",
        "Show me learning resources"
      ];
    }
    
    return [
      "Analyze my experience section",
      "Review my education details",
      "Check for ATS compatibility"
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-500" />
              Resume AI Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 max-h-96">
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`flex-1 max-w-xs ${message.type === 'user' ? 'text-right' : ''}`}>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white ml-auto' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {message.suggestions && message.type === 'bot' && (
                    <div className="ml-11 space-y-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Quick suggestions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              placeholder="Ask about resume improvements, skill gaps, or get personalized tips..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Skill Analysis
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              Resume Scoring
            </div>
            <div className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              AI Suggestions
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
