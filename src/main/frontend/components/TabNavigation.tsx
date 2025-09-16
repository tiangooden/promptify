import React from 'react';
import { MessageSquare, FileText, Bot } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'chat' | 'documents';
  onTabChange: (tab: 'chat' | 'documents') => void;
}

export default function ({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="flex">
        <div className="flex items-center gap-2 px-6">
          <Bot size={24} className="text-emerald-400" /> {/* App Icon */}
          <h2 className="text-xl font-semibold">Promptify</h2> {/* App Name */}
        </div>
        <button
          onClick={() => onTabChange('chat')}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
            activeTab === 'chat'
              ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50'
              : 'text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <MessageSquare size={18} />
          Chat
        </button>
        <button
          onClick={() => onTabChange('documents')}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
            activeTab === 'documents'
              ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50'
              : 'text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <FileText size={18} />
          Documents
        </button>
      </div>
    </div>
  );
}