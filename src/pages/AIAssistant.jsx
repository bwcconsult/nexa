import React, { useState } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm Nexus AI. How can I help you grow your business today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    
    // Mock AI response
    setTimeout(() => {
      setMessages([...newMessages, { role: "assistant", content: "That's a great question! Let me pull up the data for you..." }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`p-3 rounded-lg max-w-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="relative">
          <Input
            placeholder="Ask Nexus AI... e.g., 'Show me my top 5 customers from last month'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="pr-12 h-12"
          />
          <Button
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleSend}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}