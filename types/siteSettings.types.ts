export interface SiteSettings {
  id: number;
  site_title: string | null;
  site_logo: string | null;
  footer_logo: string | null;
  footer_logo_one: string | null;
  footer_logo_two: string | null;
  favicon: string | null;
  contact_email: string | null;
  alt_email: string | null;
  contact_phone: string | null;
  alt_phone: string | null;
  call_wp_number: string | null;
  wp_message: string | null;
  copyright: string | null;
  commision: string | null;
  site_desc: string | null;
  site_map_key: string | null;
  address: string | null;
  site_meta_desc: string | null;
  site_meta_key: string | null;
  smtp_host: string | null;
  smtp_port: string | null;
  smtp_username: string | null;
  smtp_password?: string | null;
  smtp_from_name: string | null;
  smtp_from_email: string | null;
  partner_show: '1' | '0';
  cta_title: string | null;
  cta_sub_title: string | null;
  footer_text_one: string | null;
  footer_text_two: string | null;
  social_links: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CommissionResponse {
  success: boolean;
  commission: string;
  message?: string;
}

export interface UpdateCommissionPayload {
  commision: string;
}

export interface SiteSettingsResponse {
  success: boolean;
  data: SiteSettings;
  message?: string;
}

export type UpdateSiteSettingsPayload = Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>> | FormData;