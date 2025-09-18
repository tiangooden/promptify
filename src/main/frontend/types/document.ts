export interface Document {
  id: string;
  name: string;
  content?: string;
}

export interface DocumentFilter {
  search: string;
  type: string;
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
}

export type ViewMode = 'table' | 'grid';
