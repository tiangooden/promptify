import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { Document } from '../types/document';

interface DocumentModalProps {
  document: Document | null;
  onSave: (document: Partial<Document>) => void;
  onClose: () => void;
}

export default function DocumentModal({ document, onSave, onClose }: DocumentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    type: 'txt' as Document['type'], // Initialize type for new documents
    file: null as File | null, // To store the selected file
    link: '' // To store the web link
  });
  const [selectedTab, setSelectedTab] = useState<'text' | 'file' | 'link'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const docToSave: Partial<Document> = {
      name: formData.name,
    };

    if (selectedTab === 'text') {
      docToSave.type = 'txt';
    } else if (selectedTab === 'file') {
      if (formData.file) {
        // In a real application, you would upload the file to a server
        // and store a reference (e.g., URL) in content.
        // For this example, we'll just store the file name and a placeholder content.
      }
    } else if (selectedTab === 'link') {
      docToSave.type = 'link'; // A new type for links, might need to add to Document interface
    }

    onSave(docToSave);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-emerald-600" />
            <h2 className="text-xl font-semibold text-slate-800">
              {document ? 'Edit Document' : 'Add New Document'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-150"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Document Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 outline-none transition-all duration-150"
                placeholder="Enter document name..."
                required
              />
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  type="button"
                  onClick={() => setSelectedTab('text')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'text' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('file')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'file' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  File
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('link')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'link' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  Web Link
                </button>
              </nav>
            </div>

            {/* Content Input based on selected tab */}
            {selectedTab === 'text' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 outline-none transition-all duration-150 resize-none font-mono text-sm"
                  placeholder="Enter document content..."
                  rows={8}
                />
              </div>
            )}

            {selectedTab === 'file' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload File *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {formData.file && (
                  <p className="mt-2 text-sm text-slate-600">Selected file: {formData.file.name}</p>
                )}
              </div>
            )}

            {selectedTab === 'link' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Web Link *
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 outline-none transition-all duration-150"
                  placeholder="Enter web link (e.g., https://example.com)"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-150"
            >
              <Save size={16} />
              {document ? 'Update' : 'Create'} Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}