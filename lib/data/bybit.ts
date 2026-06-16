import axios from 'axios';

export interface BybitTicker {
  symbol: string;
  volume_usd: number;
  volume_base: number;
  price: number;
  price_change_pct: number;
  exchange: 'bybit';
}

export async function getBybitTickers(): Promise<BybitTicker[]> {
  const { data } = await axios.get('https://api.bybit.com/v5/market/tickers?category=spot', {
    headers: { 'User-Agent': 'VolumeWatch/1.0' },
    timeout: 10000,
  });

  const list = data?.result?.list ?? [];

  return (list as Record<string, string>[])
    .filter((t) => t.symbol.endsWith('USDT') && parseFloat(t.turnover24h) > 0)
    .map((t) => ({
      symbol: t.symbol,
      volume_usd: parseFloat(t.turnover24h),
      volume_base: parseFloat(t.volume24h),
      price: parseFloat(t.lastPrice),
      price_change_pct: parseFloat(t.price24hPcnt) * 100,
      exchange: 'bybit' as const,
    }))
    .sort((a, b) => b.volume_usd - a.volume_usd)
    .slice(0, 100);
}
