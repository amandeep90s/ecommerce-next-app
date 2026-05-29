export type TicketCategory = 'order' | 'product' | 'shipping' | 'billing' | 'account' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

// Serialized support ticket as returned from the API (JSON-safe)
export interface ISupportTicketItem {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  orderId: string | null;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  message: string;
  status: TicketStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISubmitSupportTicketPayload {
  name: string;
  email: string;
  orderId?: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  message: string;
}

export interface ISubmitSupportTicketResponse {
  message: string;
  data?: ISupportTicketItem;
}

export interface ISupportTicketPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetSupportTicketsResponse {
  message: string;
  data: {
    items: ISupportTicketItem[];
    meta: ISupportTicketPaginationMeta;
  } | null;
}

export interface IUpdateSupportTicketPayload {
  status?: TicketStatus;
  adminNotes?: string;
  priority?: TicketPriority;
}

export interface IUpdateSupportTicketResponse {
  message: string;
  data?: ISupportTicketItem;
}

export interface IDeleteSupportTicketResponse {
  message: string;
}
