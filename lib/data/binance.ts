import axios from 'axios';

export interface BinanceTicker {
  symbol: string;
  volume_usd: number;
  volume_base: number;
  price: number;
  price_change_pct: number;
  exchange: 'binance';
}

export async function getBinanceTickers(): Promise<BinanceTicker[]> {
  const { data } = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
    headers: { 'User-Agent': 'VolumeWatch/1.0' },
    timeout: 10000,
  });

  return (data as Record<string, string>[])
    .filter((t) => t.symbol.endsWith('USDT') && parseFloat(t.quoteVolume) > 0)
    .map((t) => ({
      symbol: t.symbol,
      volume_usd: parseFloat(t.quoteVolume),
      volume_base: parseFloat(t.volume),
      price: parseFloat(t.lastPrice),
      price_change_pct: parseFloat(t.priceChangePercent),
      exchange: 'binance' as const,
    }))
    .sort((a, b) => b.volume_usd - a.volume_usd)
    .slice(0, 100);
}
