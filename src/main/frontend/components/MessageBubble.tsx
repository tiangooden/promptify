import React, { useState } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className={`flex gap-4 p-6 group hover:bg-gray-50/50 transition-colors duration-200 ${
      isUser ? 'bg-transparent' : 'bg-gray-50/30'
    }`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-emerald-500 text-white' 
          : 'bg-slate-100 text-slate-600 border border-slate-200'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-slate-800 text-sm">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-slate-400">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors duration-150"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}