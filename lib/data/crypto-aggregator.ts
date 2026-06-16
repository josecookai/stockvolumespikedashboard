import { getBinanceTickers } from './binance';
import { getBybitTickers } from './bybit';
import { getTopCoins, getTotalCryptoVolume } from './coingecko';

export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  volume_usd: number;
  volume_base: number;
  price_change_pct: number;
  market_share_pct: number;
  rel_volume: number;
  market: 'crypto';
  exchanges: string[];
}

export async function getCryptoLeaderboard(): Promise<CryptoAsset[]> {
  const [binance, bybit, topCoins, totalVolume] = await Promise.allSettled([
    getBinanceTickers(),
    getBybitTickers(),
    getTopCoins(100),
    getTotalCryptoVolume(),
  ]);

  const nameMap = new Map<string, string>();
  if (topCoins.status === 'fulfilled') {
    for (const coin of topCoins.value) {
      nameMap.set(coin.symbol.toUpperCase() + 'USDT', coin.name);
    }
  }

  const merged = new Map<string, CryptoAsset>();

  const addTickers = (tickers: { symbol: string; volume_usd: number; volume_base: number; price: number; price_change_pct: number; exchange: string }[]) => {
    for (const t of tickers) {
      const existing = merged.get(t.symbol);
      if (existing) {
        merged.set(t.symbol, {
          ...existing,
          volume_usd: existing.volume_usd + t.volume_usd,
          exchanges: [...existing.exchanges, t.exchange],
        });
      } else {
        merged.set(t.symbol, {
          symbol: t.symbol,
          name: nameMap.get(t.symbol) ?? t.symbol.replace('USDT', ''),
          price: t.price,
          volume_usd: t.volume_usd,
          volume_base: t.volume_base,
          price_change_pct: t.price_change_pct,
          market_share_pct: 0,
          rel_volume: 1,
          market: 'crypto',
          exchanges: [t.exchange],
        });
      }
    }
  };

  if (binance.status === 'fulfilled') addTickers(binance.value);
  if (bybit.status === 'fulfilled') addTickers(bybit.value);

  const total = totalVolume.status === 'fulfilled' ? totalVolume.value : 0;

  const assets = Array.from(merged.values())
    .map((a) => ({
      ...a,
      market_share_pct: total > 0 ? (a.volume_usd / total) * 100 : 0,
    }))
    .sort((a, b) => b.volume_usd - a.volume_usd)
    .slice(0, 100);

  return assets;
}
