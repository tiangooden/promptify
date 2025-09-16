export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt' | 'md' | 'xlsx' | 'pptx' | 'image' | 'link' |'other';
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

export interface DocumentFilter {
  search: string;
  type: string;
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
}

export type ViewMode = 'table' | 'grid';
