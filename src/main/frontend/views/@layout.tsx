import { useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import { effect, signal } from '@vaadin/hilla-react-signals';
import { AppLayout } from '@vaadin/react-components';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { MessageSquare, FileText, Bot } from 'lucide-react';

const documentTitleSignal = signal('');
effect(() => {
  document.title = documentTitleSignal.value;
});

// Publish for Vaadin to use
(window as any).Vaadin.documentTitleSignal = documentTitleSignal;

export default function MainLayout() {
  const currentTitle = useViewConfig()?.title;

  useEffect(() => {
    if (currentTitle) {
      documentTitleSignal.value = currentTitle;
    }
  }, [currentTitle]);

  const location = useLocation();
  const navigate = useNavigate();
  const isDocumentsRoute = location.pathname === '/documents';
  
  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          <div className="flex items-center gap-2 px-6">
            <Bot size={24} className="text-emerald-400" />
            <h2 className="text-xl font-semibold">Promptify</h2>
          </div>
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
              !isDocumentsRoute
                ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50'
                : 'text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <MessageSquare size={18} />
            Chat
          </button>
          <button
            onClick={() => navigate('/documents')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
              isDocumentsRoute
                ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50'
                : 'text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileText size={18} />
            Documents
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
