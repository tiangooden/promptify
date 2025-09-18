import { ChatSession, Message } from "../types/chat";
import { Document } from "../types/document";

import { API_BASE_URL } from "./constants";

export const getChatSessions = async (): Promise<ChatSession[]> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions`);
  if (!response.ok) {
    throw new Error("Failed to fetch chat sessions");
  }
  return response.json();
};

export const getChatSession = async (id: string): Promise<ChatSession> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch chat session ${id}`);
  }
  return response.json();
};

export const createChatSession = async (title: string): Promise<ChatSession> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error("Failed to create chat session");
  }
  return response.json();
};

export const deleteChatSession = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete chat session ${id}`);
  }
};

export const sendMessage = async (content: string): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: content }),
  });
  if (!response.ok) {
    throw new Error("Failed to send message");
  }
  return response.json();
};

export const getDocuments = async (): Promise<Document[]> => {
  const response = await fetch(`${API_BASE_URL}/documents`);
  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }
  return response.json();
};

export const ingestText = async (content: string): Promise<Document> => {
  const response = await fetch(`${API_BASE_URL}/ingest/text`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: content,
  });
  if (!response.ok) {
    throw new Error("Failed to ingest text");
  }
  return response.json();
};

export const uploadDocument = async (file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/ingest/file`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload document");
  }
  return response.json();
};

export const deleteDocument = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete document ${id}`);
  }
};