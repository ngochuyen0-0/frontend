// types/profile.ts
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role?: string;
  created_at?: string;
  status?: "ACTIVE" | "BANNED";
  loyalty_points?: [
    {
      points: number,
      user_id: string,
      description: string,
      current_streak: number,
      source: "daily_login",
      id: string,
      created_at: string,
      max_streak: number
    }
  ];
  user_info?: any;
  user_tiers?: any;
  user_vouchers?: any;
  wishlists?: any;
}


export interface UserProfiles {
  total: number,
  page: number,
  max_page: number,
  row: number,
  data: UserProfile[]
}

export interface DailyRewardHistory {
  history: [
    {
      id: string,
      amount: number,
      reason: string,
      created_at: string,
      weekday: string
    }
  ],
  current_streak: number
}

export interface OrderHistory {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  total: number;
  items: number;
}

export interface CoinHistory {
  id: string;
  type: 'earn' | 'spend' | 'reward';
  amount: number;
  description: string;
  date: string;
  balance: number;
}

