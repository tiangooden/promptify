import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import ChatInterface from 'Frontend/components/ChatInterface';
import DocumentManagement from 'Frontend/components/DocumentManagement';
import TabNavigation from 'Frontend/components/TabNavigation';
import { useState } from 'react';

export const config: ViewConfig = {
  menu: { order: 0, icon: 'line-awesome/svg/globe-solid.svg' },
  title: 'Hello World',
};

export default function HelloWorldView() {
  const [activeTab, setActiveTab] = useState<'chat' | 'documents'>('chat');

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <ChatInterface />
        ) : (
          <DocumentManagement />
        )}
      </div>
    </div>
  );
}
