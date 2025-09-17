import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  onStopGeneration?: () => void;
}

export default function ChatInput({ onSendMessage, isLoading, onStopGeneration }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      const messageToSend = message.trim();
      setMessage('');
      onSendMessage(messageToSend);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Shift+Enter for new line)"
              className="flex-1 resize-none bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 min-h-[24px] max-h-[200px]"
              rows={1}
              disabled={isLoading}
            />
            
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="flex-shrink-0 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-150 group"
                title="Stop generation"
              >
                <Square size={16} className="group-hover:scale-110 transition-transform duration-150" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex-shrink-0 p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-150 group"
                title="Send message"
              >
                <Send size={16} className="group-hover:scale-110 transition-transform duration-150" />
              </button>
            )}
          </div>
        </form>
        
        <p className="text-xs text-slate-400 text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}