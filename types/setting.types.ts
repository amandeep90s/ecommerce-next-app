export interface ISettingSocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

export interface ISettingsItem {
  id: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  logoUrl: string;
  currency: string;
  currencySymbol: string;
  socialLinks: ISettingSocialLinks;
  seoMetaTitle: string;
  seoMetaDescription: string;
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateSettingsPayload {
  storeName?: string;
  storeEmail?: string;
  storePhone?: string;
  storeAddress?: string;
  logoUrl?: string;
  currency?: string;
  currencySymbol?: string;
  socialLinks?: Partial<ISettingSocialLinks>;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  maintenanceMode?: boolean;
}

export interface IGetSettingsResponse {
  message: string;
  data: ISettingsItem | null;
}

export interface IUpdateSettingsResponse {
  message: string;
  data?: ISettingsItem;
}
