import axios from 'axios';

export interface StockAsset {
  symbol: string;
  name: string;
  price: number;
  volume_usd: number;
  volume_shares: number;
  price_change_pct: number;
  rel_volume: number;
  market_share_pct: number;
  market: 'stock';
  exchange: string;
}

const YAHOO_SCREENER =
  'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=MOST_ACTIVES&count=50';

const TOTAL_US_MARKET_VOLUME_USD = 500_000_000_000;

export async function getMostActiveStocks(limit = 50): Promise<StockAsset[]> {
  try {
    const { data } = await axios.get(YAHOO_SCREENER, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VolumeWatch/1.0)' },
      timeout: 10000,
    });

    const quotes: Record<string, string | number>[] =
      data?.finance?.result?.[0]?.quotes ?? [];

    return quotes.slice(0, limit).map((q) => ({
      symbol: String(q.symbol),
      name: String(q.shortName ?? q.longName ?? q.symbol),
      price: Number(q.regularMarketPrice ?? 0),
      volume_shares: Number(q.regularMarketVolume ?? 0),
      volume_usd: Number(q.regularMarketPrice ?? 0) * Number(q.regularMarketVolume ?? 0),
      price_change_pct: Number(q.regularMarketChangePercent ?? 0),
      rel_volume: 1,
      market_share_pct: 0,
      market: 'stock' as const,
      exchange: String(q.fullExchangeName ?? 'US'),
    }));
  } catch (err) {
    console.error('[stocks] Yahoo Finance fetch failed:', err);
    return [];
  }
}

export async function getTotalStockMarketVolume(): Promise<number> {
  return TOTAL_US_MARKET_VOLUME_USD;
}
