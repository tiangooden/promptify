import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Grid3X3,
  List,
  Trash2,
  Edit3,
  FileText,
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import { Document, DocumentFilter, ViewMode } from '../types/document';
import DocumentModal from './DocumentModal';
import { getDocuments, deleteDocument, uploadDocument } from '../utils/api';
import { useTextIngest } from 'Frontend/hooks/useTextIngest';

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    file: null as File | null,
    link: ''
  });
  const [selectedTab, setSelectedTab] = useState<'text' | 'file' | 'link'>('text');
  const [filter, setFilter] = useState<DocumentFilter>({
    search: '',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const { ingestTextContent, isLoading: isIngestLoading, error: ingestError } = useTextIngest();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedDocs = await getDocuments();
      setDocuments(fetchedDocs);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...documents];

    if (filter.search) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        doc.content?.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filter.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = a.content?.toLowerCase();
          bValue = b.content?.toLowerCase();
          break;
        default:
          return 0;
      }

      if (filter.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredDocuments(filtered);
  }, [documents, filter]);

  const handleSelectDocument = (docId: string) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocuments(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDocuments.size === filteredDocuments.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(filteredDocuments.map(doc => doc.id)));
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteDocument(docId);
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
    } catch (err) {
      console.error(`Failed to delete document ${docId}:`, err);
      setError(`Failed to delete document. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all(Array.from(selectedDocuments).map(id => deleteDocument(id)));
      setDocuments(prev => prev.filter(doc => !selectedDocuments.has(doc.id)));
      setSelectedDocuments(new Set());
    } catch (err) {
      console.error("Failed to delete selected documents:", err);
      setError("Failed to delete selected documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDocument(doc);
    setShowModal(true);
  };

  const handleSaveDocument = async (docData: Partial<Document>, file?: File) => {
    setIsLoading(true);
    setError(null);
    try {
      if (editingDocument) {
        await ingestTextContent(docData.content || '', docData.name || '');
        setDocuments(prev => prev.map(doc =>
          doc.id === editingDocument.id
            ? { ...doc, ...docData, updatedAt: new Date() }
            : doc
        ));
        await fetchDocuments();
      } else if (file) {
        const newDoc = await uploadDocument(file);
        setDocuments(prev => [newDoc, ...prev]);
      }
      setShowModal(false);
      setEditingDocument(null);
    } catch (err) {
      console.error("Failed to save document:", err);
      setError("Failed to save document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Document Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-150"
            disabled={isLoading} // Disable button when loading
          >
            <Plus size={16} />
            Add Document
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 outline-none transition-all duration-150"
              disabled={isLoading} // Disable input when loading
            />
          </div>

          {/* View Toggle */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-colors duration-150 ${viewMode === 'table'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
              disabled={isLoading} // Disable button when loading
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors duration-150 ${viewMode === 'grid'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
              disabled={isLoading} // Disable button when loading
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDocuments.size > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-emerald-700">
              {selectedDocuments.size} document{selectedDocuments.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
                disabled={isLoading} // Disable button when loading
              >
                <Trash2 size={14} />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedDocuments(new Set())}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                disabled={isLoading} // Disable button when loading
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {error && ( // Display error message
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {isLoading && filteredDocuments.length === 0 ? ( // Show loading indicator when fetching initial documents
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No documents found</h3>
              <p className="text-slate-400">
                {filter.search || filter.type !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Upload your first document to get started'
                }
              </p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="w-12 p-4">
                    <button
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-slate-600 transition-colors duration-150"
                      disabled={isLoading}
                    >
                      {selectedDocuments.size === filteredDocuments.length ?
                        <CheckSquare size={16} /> :
                        <Square size={16} />
                      }
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">Name</th>
                  <th className="text-left p-4 font-medium text-slate-700">Content</th>
                  <th className="w-16 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                    <td className="p-4">
                      <button
                        onClick={() => handleSelectDocument(doc.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors duration-150"
                        disabled={isLoading}
                      >
                        {selectedDocuments.has(doc.id) ?
                          <CheckSquare size={16} /> :
                          <Square size={16} />
                        }
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-slate-800">{doc.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 uppercase text-sm">{doc.content}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditDocument(doc)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                          title="Edit"
                          disabled={isLoading}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors duration-150"
                          title="Delete"
                          disabled={isLoading}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSelectDocument(doc.id)}
                      className="text-slate-400 hover:text-slate-600 transition-colors duration-150"
                      disabled={isLoading}
                    >
                      {selectedDocuments.has(doc.id) ?
                        <CheckSquare size={16} /> :
                        <Square size={16} />
                      }
                    </button>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditDocument(doc)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                      title="Edit"
                      disabled={isLoading}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors duration-150"
                      title="Delete"
                      disabled={isLoading}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="font-medium text-slate-800 mb-2 truncate" title={doc.name}>
                  {doc.name}
                </h3>
                <h6 className="font-medium text-slate-800 mb-2 truncate" title={doc.content}>
                  {doc.content}
                </h6>
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <DocumentModal
          document={editingDocument}
          onSave={handleSaveDocument}
          onClose={() => {
            setShowModal(false);
            setEditingDocument(null);
          }}
          formData={formData}
          setFormData={setFormData}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
    </div>
  );
}