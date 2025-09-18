import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import ChatInterface from 'Frontend/components/ChatInterface';

export const config: ViewConfig = {
  menu: { order: 0, icon: 'line-awesome/svg/globe-solid.svg' },
  title: 'Chat',
};

export default function ChatView() {
  return <ChatInterface />;
}
