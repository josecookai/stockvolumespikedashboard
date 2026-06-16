import axios from 'axios';

export interface MarketVolumeData {
  totalUsd: number;
  nasdaqSource: { totalSharesB: number; totalUsdB: number; date: string } | null;
  cboeSource: { nasdaqSharePct: number; cboeSharePct: number; atsSharePct: number } | null;
  fetchedAt: string;
}

// Cache for 6 hours (refresh once per trading day)
let cache: MarketVolumeData | null = null;
let cacheTs = 0;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// SIFMA 2025 ADV baseline — ~19–20B shares × $47 avg price
const FALLBACK_USD = 900_000_000_000;

/**
 * Nasdaq Trader Full Volume Summary
 * URL: https://nasdaqtrader.com/trader.aspx?id=FullVolumeSummary
 * Contains consolidated tape total shares and dollar volume.
 */
async function fetchNasdaqTrader(): Promise<MarketVolumeData['nasdaqSource']> {
  const { data } = await axios.get(
    'https://nasdaqtrader.com/trader.aspx?id=FullVolumeSummary',
    { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }
  );
  const html = String(data);

  // Extract total consolidated volume (shares) — appears as "X,XXX,XXX,XXX"
  const sharesMatch = html.match(/Total\s+Consolidated\s+Volume[^<]*<[^>]+>([0-9,]+)/i);
  const dollarMatch = html.match(/Total\s+Dollar\s+Volume[^<]*<[^>]+>\$?([0-9,.]+)/i);
  const dateMatch  = html.match(/as\s+of\s+([\w]+\s+\d{1,2},?\s+\d{4})/i);

  if (!sharesMatch) throw new Error('nasdaq: no shares data');

  const totalSharesB = parseFloat(sharesMatch[1].replace(/,/g, '')) / 1e9;
  const totalUsdB = dollarMatch
    ? parseFloat(dollarMatch[1].replace(/,/g, '')) / 1e9
    : totalSharesB * 47; // fallback: ~$47 avg price

  return { totalSharesB, totalUsdB, date: dateMatch?.[1] ?? new Date().toDateString() };
}

/**
 * CBOE US Equities Market Share
 * URL: https://www.cboe.com/us/equities/market_share/
 * Shows % share for each exchange (Nasdaq, NYSE, CBOE, ATS/dark pools, etc.)
 */
async function fetchCBOEMarketShare(): Promise<MarketVolumeData['cboeSource']> {
  const { data } = await axios.get(
    'https://www.cboe.com/us/equities/market_share/',
    { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }
  );
  const html = String(data);

  // Extract percentage values for key exchange groups
  const extract = (label: string): number => {
    const re = new RegExp(label + '[^<]*<[^>]+>([0-9]+\\.?[0-9]*)\\s*%', 'i');
    const m = html.match(re);
    return m ? parseFloat(m[1]) : 0;
  };

  const nasdaqSharePct = extract('NASDAQ') || extract('NQ');
  const cboeSharePct   = extract('CBOE');
  const atsSharePct    = extract('ATS') || extract('TRF') || extract('Off-Exchange');

  if (nasdaqSharePct === 0 && cboeSharePct === 0) throw new Error('cboe: no data');

  return { nasdaqSharePct, cboeSharePct, atsSharePct };
}

export async function getMarketVolumeData(): Promise<MarketVolumeData> {
  const now = Date.now();
  if (cache && now - cacheTs < CACHE_TTL_MS) return cache;

  const [nasdaqResult, cboeResult] = await Promise.allSettled([
    fetchNasdaqTrader(),
    fetchCBOEMarketShare(),
  ]);

  const nasdaqSource = nasdaqResult.status === 'fulfilled' ? nasdaqResult.value : null;
  const cboeSource   = cboeResult.status   === 'fulfilled' ? cboeResult.value   : null;

  // Best estimate of total dollar volume:
  // 1. Prefer Nasdaq Trader's reported dollar volume
  // 2. Fall back to SIFMA baseline
  const totalUsd = nasdaqSource
    ? nasdaqSource.totalUsdB * 1e9
    : FALLBACK_USD;

  cache = { totalUsd, nasdaqSource, cboeSource, fetchedAt: new Date().toISOString() };
  cacheTs = now;
  return cache;
}

export async function getTotalUSMarketVolume(): Promise<number> {
  const d = await getMarketVolumeData().catch(() => null);
  return d?.totalUsd ?? FALLBACK_USD;
}
