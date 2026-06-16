import { getAllSP500Stocks, StockAsset } from './stocks';
import { getTotalUSMarketVolume } from './market-volume';
import { generateSP500MockData } from './sp500';

export type { StockAsset };

export async function getStocksLeaderboard(): Promise<StockAsset[]> {
  const [stocks, totalVolumeUsd] = await Promise.all([
    getAllSP500Stocks(),
    getTotalUSMarketVolume(),
  ]);

  return stocks
    .map((s) => ({
      ...s,
      market_share_pct: totalVolumeUsd > 0
        ? +((s.volume_usd / totalVolumeUsd) * 100).toFixed(4)
        : 0,
    }))
    .sort((a, b) => b.volume_usd - a.volume_usd);
}

/** Fallback: deterministic mock when Yahoo Finance is unavailable */
export function getStocksMockLeaderboard(totalVolumeUsd = 900_000_000_000): StockAsset[] {
  return generateSP500MockData(totalVolumeUsd).map((s) => ({
    ...s,
    volume_shares: 0,
    exchange: 'US',
  }));
}
