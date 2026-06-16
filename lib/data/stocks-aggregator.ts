import { getMostActiveStocks, getTotalStockMarketVolume, StockAsset } from './stocks';

const avgVolumeCache = new Map<string, { avg: number; updatedAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function updateAvgCache(assets: StockAsset[]) {
  const now = Date.now();
  for (const a of assets) {
    const entry = avgVolumeCache.get(a.symbol);
    if (!entry || now - entry.updatedAt > CACHE_TTL_MS) {
      avgVolumeCache.set(a.symbol, { avg: a.volume_usd, updatedAt: now });
    }
  }
}

function computeRelVolume(symbol: string, currentVolumeUsd: number): number {
  const entry = avgVolumeCache.get(symbol);
  if (!entry || entry.avg === 0) return 1;
  return currentVolumeUsd / entry.avg;
}

export async function getStocksLeaderboard(): Promise<StockAsset[]> {
  const [stocks, totalVolume] = await Promise.all([
    getMostActiveStocks(50),
    getTotalStockMarketVolume(),
  ]);

  updateAvgCache(stocks);

  return stocks
    .map((s) => ({
      ...s,
      rel_volume: computeRelVolume(s.symbol, s.volume_usd),
      market_share_pct: totalVolume > 0 ? (s.volume_usd / totalVolume) * 100 : 0,
    }))
    .sort((a, b) => b.volume_usd - a.volume_usd);
}
