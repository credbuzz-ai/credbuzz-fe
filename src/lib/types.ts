export interface KOL {
  user_id: number;
  wallet_addr: string | null;
  author_handle: string;
}

export interface Campaign {
  campaign_id: number;
  business_user_id: number;
  business_wallet_addr: string;
  kol_user_id: number;
  kol_wallet_addr: string;
  project_name: string;
  description: string;
  x_author_handle: string;
  website: string;
  amount: number;
  status: string;
  offer_end_date: number;
  promotion_end_date: number;
}
