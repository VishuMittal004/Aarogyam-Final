'use client';

import { multilingualAIChat } from '@/ai/flows/multilingual-ai-chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Bot, Loader2, Send, User, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const languages = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'हिंदी (Hindi)' },
  { value: 'bengali', label: 'বাংলা (Bengali)' },
  { value: 'marathi', label: 'मराठी (Marathi)' },
  { value: 'telugu', label: 'తెలుగు (Telugu)' },
  { value: 'tamil', label: 'தமிழ் (Tamil)' },
  { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' },
  { value: 'punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'urdu', label: 'اردو (Urdu)' },
];

export default function ChatInterface() {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I am your Aarogyam Health Assistant. How can I help you with your health questions today? You can ask me in any language.',
    },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState(languages[0].value);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const saveToHistory = async (newMessages: Message[]) => {
    try {
      await fetch('/api/chat/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, language }),
      });
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    startTransition(async () => {
      try {
        const assistantMessage = await multilingualAIChat({ language, message: currentInput });
        const botMessage: Message = { role: 'assistant', content: assistantMessage.response };
        setMessages((prev) => [...prev, botMessage]);
        // Save both messages to history
        saveToHistory([userMessage, botMessage]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
        ]);
      }
    });
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Namaste! 🙏 I am your Aarogyam Health Assistant. How can I help you with your health questions today?',
    }]);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 p-4 bg-card/30">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-lg font-semibold text-foreground">AI Health Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[160px] bg-input/50 border-border/50">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/50">
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={clearChat} className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
              {message.role === 'assistant' && (
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                'max-w-[75%] rounded-2xl p-4 text-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted/50 border border-border/30 rounded-bl-sm'
              )}>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="text-sm"><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm"><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-muted/50 border border-border/30 rounded-2xl rounded-bl-sm p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border/50 bg-background/30 p-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your health concerns..."
            className="flex-1 text-sm bg-input/50 border-border/50 focus:border-primary/50"
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={isPending || !input.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
