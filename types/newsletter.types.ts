// Serialized newsletter subscriber as returned from the API (JSON-safe)
export interface INewsletterItem {
  id: string;
  email: string;
  subscribedAt: string;
  unsubscribeToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISubscribeNewsletterPayload {
  email: string;
}

export interface ISubscribeNewsletterResponse {
  message: string;
  data?: INewsletterItem;
}

export interface IUnsubscribeNewsletterResponse {
  message: string;
}

export interface INewsletterPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetNewsletterSubscribersResponse {
  message: string;
  data: {
    items: INewsletterItem[];
    meta: INewsletterPaginationMeta;
  } | null;
}

export interface IDeleteNewsletterSubscriberResponse {
  message: string;
}
