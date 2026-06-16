import { sql } from '@vercel/postgres';

export { sql };

export interface VolumeSnapshot {
  id?: number;
  symbol: string;
  market: 'crypto' | 'stock';
  exchange?: string;
  volume_usd: number;
  volume_base?: number;
  price?: number;
  price_change_pct?: number;
  market_share_pct?: number;
  rel_volume?: number;
  snapshot_at?: string;
}

export interface DailyVolumeSummary {
  id?: number;
  symbol: string;
  market: string;
  exchange?: string;
  date: string;
  volume_usd_total: number;
  avg_price?: number;
  market_share_pct?: number;
}

export interface AlertRule {
  id: number;
  symbol: string | null;
  market: string | null;
  threshold_x: number;
  telegram_chat: string;
  enabled: boolean;
  created_at: string;
}

export interface AlertHistory {
  id?: number;
  symbol: string;
  market: string;
  volume_usd: number;
  rel_volume: number;
  triggered_at?: string;
}
