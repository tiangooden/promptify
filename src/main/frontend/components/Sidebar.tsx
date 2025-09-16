import React from 'react';
import { Plus, MessageSquare, Menu, X, Trash2, Edit3 } from 'lucide-react';
import { ChatSession } from '../types/chat';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  isOpen,
  onToggle
}: SidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white text-slate-900 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-150 group"
            >
              <Plus size={20} className="group-hover:scale-110 transition-transform duration-150" />
              New Chat
            </button>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Chats</h3>

            {sessions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats yet</p>
                <p className="text-xs mt-1">Start a conversation to see your chat history</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-150 hover:text-white hover:bg-emerald-600 ${currentSessionId === session.id ? 'bg-white ring-1 ring-emerald-500/50' : ''
                    }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare size={16} className="mt-0.5 flex-shrink-0 text-slate-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-slate-700 mt-1">
                        {formatDate(session.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute top-2 right-2 p-1 group-hover:opacity-100 hover:bg-slate-700 rounded transition-all duration-150"
                  >
                    <Trash2 size={14} className="text-red-400 hover:text-red-300" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <div className="text-xs text-slate-400 text-center">
              <p>LLM Chat Assistant</p>
              <p className="mt-1">Built with modern web technologies</p>
              <p className="mt-1">version 0.0.1</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}