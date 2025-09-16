import React from 'react';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-4 p-6 bg-gray-50/30">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 border border-slate-200">
        <Bot size={16} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-slate-800 text-sm">Assistant</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-slate-500 ml-2">Thinking...</span>
        </div>
      </div>
    </div>
  );
}