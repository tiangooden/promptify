import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import DocumentManagement from 'Frontend/components/DocumentManagement';

export const config: ViewConfig = { 
  menu: { order: 1, icon: 'line-awesome/svg/file-text-solid.svg' }, 
  title: 'Documents' 
};

export default function DocumentsView() {
  return <DocumentManagement />;
}