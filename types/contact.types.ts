export type ContactStatus = 'new' | 'read' | 'replied';

// Serialized contact submission as returned from the API (JSON-safe)
export interface IContactItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ISubmitContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ISubmitContactResponse {
  message: string;
  data?: IContactItem;
}

export interface IContactPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetContactSubmissionsResponse {
  message: string;
  data: {
    items: IContactItem[];
    meta: IContactPaginationMeta;
  } | null;
}

export interface IUpdateContactStatusPayload {
  status: ContactStatus;
}

export interface IUpdateContactStatusResponse {
  message: string;
  data?: IContactItem;
}

export interface IDeleteContactSubmissionResponse {
  message: string;
}
