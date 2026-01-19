
export type KanbanStatus = 'NOVO' | 'ATENDIMENTO' | 'AGUARDANDO' | 'RESOLVIDO';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  fromMe: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: KanbanStatus;
  lastMessage?: string;
  lastMessageTime?: string;
  assignedTo?: string;
  tags?: string[];
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENT';
}

export interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  contacts: Contact[];
  activeContactId: string | null;
  connectionStatus: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
  qrCode: string | null;
}
