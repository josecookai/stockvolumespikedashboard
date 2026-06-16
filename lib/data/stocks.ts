import axios from 'axios';
import { SP500 } from './sp500';

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
  sparkline: number[];
}

interface YahooQuote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketVolume?: number;
  regularMarketChangePercent?: number;
  averageDailyVolume10Day?: number;
  averageDailyVolume3Month?: number;
  fullExchangeName?: string;
}

const CHUNK_SIZE = 100;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let cache: StockAsset[] | null = null;
let cacheTs = 0;

async function fetchQuoteChunk(symbols: string[]): Promise<YahooQuote[]> {
  const { data } = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote', {
    params: { symbols: symbols.join(',') },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VolumeWatch/1.0)' },
    timeout: 20000,
  });
  return (data?.quoteResponse?.result as YahooQuote[]) ?? [];
}

export async function getAllSP500Stocks(): Promise<StockAsset[]> {
  const now = Date.now();
  if (cache && now - cacheTs < CACHE_TTL_MS) return cache;

  const symbols = SP500.map((s) => s.symbol);
  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += CHUNK_SIZE) {
    chunks.push(symbols.slice(i, i + CHUNK_SIZE));
  }

  const results = await Promise.allSettled(chunks.map(fetchQuoteChunk));
  const quotes = results
    .filter((r): r is PromiseFulfilledResult<YahooQuote[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  if (quotes.length === 0) throw new Error('Yahoo Finance returned no data');

  const infoMap = new Map(SP500.map((s) => [s.symbol, s]));

  const assets: StockAsset[] = quotes
    .filter((q) => q.regularMarketPrice != null)
    .map((q) => {
      const info = infoMap.get(q.symbol);
      const price = q.regularMarketPrice ?? 0;
      const volumeShares = q.regularMarketVolume ?? 0;
      const volumeUsd = price * volumeShares;
      const avgShares = q.averageDailyVolume10Day ?? q.averageDailyVolume3Month ?? volumeShares;
      const relVolume = avgShares > 0 ? +(volumeShares / avgShares).toFixed(2) : 1;

      return {
        symbol: q.symbol,
        name: info?.name ?? q.shortName ?? q.longName ?? q.symbol,
        price,
        volume_shares: volumeShares,
        volume_usd: volumeUsd,
        price_change_pct: +(q.regularMarketChangePercent ?? 0).toFixed(2),
        rel_volume: relVolume,
        market_share_pct: 0, // filled in by aggregator
        market: 'stock' as const,
        exchange: q.fullExchangeName ?? 'US',
        sparkline: [], // no sparkline for real data (avoids extra API calls)
      };
    });

  cache = assets;
  cacheTs = now;
  return assets;
}

// Invalidate cache (e.g. after market close cron)
export function invalidateStocksCache() {
  cache = null;
  cacheTs = 0;
}
