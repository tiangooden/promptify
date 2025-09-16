import React, { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import Sidebar from './Sidebar';
import { Message, ChatSession } from '../types/chat';

export default function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Create new chat session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: nanoid(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setSidebarOpen(false);
  };

  // Update session title based on first message
  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? { 
            ...session, 
            title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : ''),
            updatedAt: new Date()
          }
        : session
    ));
  };

  // Add message to current session
  const addMessage = (sessionId: string, message: Message) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? { 
            ...session, 
            messages: [...session.messages, message],
            updatedAt: new Date()
          }
        : session
    ));
  };

  // Simulate AI response
  const simulateAIResponse = async (userMessage: string) => {
    const responses = [
      "That's an interesting question! Let me think about this...",
      "I understand what you're asking. Here's my perspective on that topic...",
      "Great question! Based on the information available, I can tell you that...",
      "I appreciate you sharing that with me. Here's what I think about your situation...",
      "That's a thoughtful inquiry. Let me provide you with a comprehensive response...",
      "I see what you're getting at. This is definitely something worth exploring further...",
      "Thank you for that question. I'd be happy to help you understand this better...",
      "That's a complex topic with several aspects to consider. Let me break it down for you..."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const fullResponse = `${randomResponse}\n\nThis is a simulated response to demonstrate the chat interface. In a real implementation, this would be connected to an actual LLM API like OpenAI's GPT, Anthropic's Claude, or Google's Gemini.\n\nYour message was: "${userMessage}"`;

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return fullResponse;
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) {
      createNewSession();
      return;
    }

    const userMessage: Message = {
      id: nanoid(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message
    addMessage(currentSessionId, userMessage);

    // Update session title if it's the first message
    if (messages.length === 0) {
      updateSessionTitle(currentSessionId, content);
    }

    setIsLoading(true);

    try {
      const aiResponse = await simulateAIResponse(content);
      
      const assistantMessage: Message = {
        id: nanoid(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      addMessage(currentSessionId, assistantMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: nanoid(),
        content: "I apologize, but I encountered an error while processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };

      addMessage(currentSessionId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  };

  // Initialize with a default session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, []);

  return (
    <div className="flex h-full bg-white">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={createNewSession}
        onSelectSession={setCurrentSessionId}
        onDeleteSession={handleDeleteSession}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Main Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full px-4">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-3">
                  Welcome to Promptify
                </h1>
                <p className="text-slate-600 leading-relaxed">
                  Start a conversation with our AI assistant. Ask questions, get help with tasks, or just have a friendly chat!
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStopGeneration={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}