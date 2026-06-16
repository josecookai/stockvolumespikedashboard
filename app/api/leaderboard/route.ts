import { NextResponse } from 'next/server';
import { generateSP500MockData } from '@/lib/data/sp500';

const TOTAL_STOCK_VOL = 900_000_000_000; // SIFMA 2025 ADV baseline

const CRYPTO_ASSETS = [
  { symbol: 'BTCUSDT',    name: 'Bitcoin',      market: 'crypto' as const, price: 67420,   price_change_pct:  2.3,  volume_usd: 28_400_000_000, rel_volume: 1.2, market_share_pct: 28.4, sparkline: [22_000, 25_000, 24_000, 27_000, 26_000, 28_000, 28_400] },
  { symbol: 'ETHUSDT',    name: 'Ethereum',     market: 'crypto' as const, price: 3540,    price_change_pct:  1.8,  volume_usd: 14_200_000_000, rel_volume: 1.1, market_share_pct: 14.2, sparkline: [11_000, 13_000, 12_000, 14_000, 14_000, 14_000, 14_200] },
  { symbol: 'SOLUSDT',    name: 'Solana',       market: 'crypto' as const, price: 178.4,   price_change_pct:  4.1,  volume_usd:  5_800_000_000, rel_volume: 2.1, market_share_pct:  5.8, sparkline: [2_000, 3_000, 3_000, 4_000, 5_000, 5_000, 5_800] },
  { symbol: 'XRPUSDT',    name: 'XRP',          market: 'crypto' as const, price: 0.62,    price_change_pct: -1.2,  volume_usd:  4_100_000_000, rel_volume: 0.9, market_share_pct:  4.1, sparkline: [4_500, 4_200, 4_000, 3_900, 4_100, 4_000, 4_100] },
  { symbol: 'DOGEUSDT',   name: 'Dogecoin',     market: 'crypto' as const, price: 0.18,    price_change_pct:  6.3,  volume_usd:  3_900_000_000, rel_volume: 3.2, market_share_pct:  3.9, sparkline: [800, 900, 1_000, 1_200, 2_000, 3_200, 3_900] },
  { symbol: 'BNBUSDT',    name: 'BNB',          market: 'crypto' as const, price: 612,     price_change_pct:  0.9,  volume_usd:  2_800_000_000, rel_volume: 1.0, market_share_pct:  2.8, sparkline: [2_700, 2_750, 2_800, 2_750, 2_800, 2_800, 2_800] },
  { symbol: 'ADAUSDT',    name: 'Cardano',      market: 'crypto' as const, price: 0.48,    price_change_pct:  3.2,  volume_usd:  1_200_000_000, rel_volume: 1.4, market_share_pct:  1.2, sparkline: [800, 900, 1_000, 1_100, 1_100, 1_200, 1_200] },
  { symbol: 'AVAXUSDT',   name: 'Avalanche',    market: 'crypto' as const, price: 38.5,    price_change_pct:  5.1,  volume_usd:    980_000_000, rel_volume: 1.8, market_share_pct:  0.98, sparkline: [500, 600, 700, 800, 900, 950, 980] },
  { symbol: 'LINKUSDT',   name: 'Chainlink',    market: 'crypto' as const, price: 16.2,    price_change_pct:  2.7,  volume_usd:    870_000_000, rel_volume: 1.3, market_share_pct:  0.87, sparkline: [700, 720, 750, 800, 820, 850, 870] },
  { symbol: 'PUMPBTCUSDT',name: 'PumpBTC',      market: 'crypto' as const, price: 0.01066, price_change_pct:  8.4,  volume_usd:    850_000_000, rel_volume: 3.4, market_share_pct:  0.85, sparkline: [200, 300, 400, 500, 700, 800, 850] },
  { symbol: 'DOTUSDT',    name: 'Polkadot',     market: 'crypto' as const, price: 7.8,     price_change_pct:  1.5,  volume_usd:    640_000_000, rel_volume: 1.0, market_share_pct:  0.64, sparkline: [630, 640, 630, 640, 640, 640, 640] },
  { symbol: 'SUIUSDT',    name: 'Sui',          market: 'crypto' as const, price: 3.82,    price_change_pct:  7.2,  volume_usd:    490_000_000, rel_volume: 2.6, market_share_pct:  0.49, sparkline: [150, 200, 250, 300, 400, 450, 490] },
  { symbol: 'WIFUSDT',    name: 'dogwifhat',    market: 'crypto' as const, price: 2.14,    price_change_pct: 12.4,  volume_usd:    450_000_000, rel_volume: 4.1, market_share_pct:  0.45, sparkline: [80, 100, 120, 180, 280, 380, 450] },
  { symbol: 'GRASSUSDT',  name: 'Grass',        market: 'crypto' as const, price: 0.38,    price_change_pct: -2.1,  volume_usd:    320_000_000, rel_volume: 1.6, market_share_pct:  0.32, sparkline: [380, 360, 340, 330, 325, 320, 320] },
  { symbol: 'JUPUSDT',    name: 'Jupiter',      market: 'crypto' as const, price: 0.92,    price_change_pct:  3.8,  volume_usd:    290_000_000, rel_volume: 1.4, market_share_pct:  0.29, sparkline: [200, 220, 240, 260, 275, 285, 290] },
  { symbol: 'PENDLEUSDT', name: 'Pendle',       market: 'crypto' as const, price: 5.42,    price_change_pct:  9.1,  volume_usd:    260_000_000, rel_volume: 3.8, market_share_pct:  0.26, sparkline: [60, 80, 100, 150, 200, 240, 260] },
  { symbol: 'ENAUSDT',    name: 'Ethena',       market: 'crypto' as const, price: 0.38,    price_change_pct:  4.2,  volume_usd:    240_000_000, rel_volume: 1.9, market_share_pct:  0.24, sparkline: [120, 150, 170, 200, 220, 230, 240] },
  { symbol: 'A8USDT',     name: 'Ancient8',     market: 'crypto' as const, price: 0.0078,  price_change_pct: -3.4,  volume_usd:     95_000_000, rel_volume: 1.2, market_share_pct:  0.095, sparkline: [90, 95, 92, 94, 95, 94, 95] },
  { symbol: 'NEARUSDT',   name: 'NEAR Protocol',market: 'crypto' as const, price: 6.1,     price_change_pct:  1.9,  volume_usd:     88_000_000, rel_volume: 0.9, market_share_pct:  0.088, sparkline: [90, 88, 87, 88, 88, 88, 88] },
  { symbol: 'MATICUSDT',  name: 'Polygon',      market: 'crypto' as const, price: 0.68,    price_change_pct: -0.5,  volume_usd:    520_000_000, rel_volume: 0.8, market_share_pct:  0.52,  sparkline: [560, 550, 540, 530, 525, 522, 520] },
];

// Add SPCX as a special high-volume stock
const SPCX_ROW = {
  symbol: 'SPCX', name: 'SpaceX', market: 'stock' as const,
  price: 212.17, price_change_pct: 10.22,
  volume_usd: 47_300_000_000, rel_volume: 8.2,
  market_share_pct: (47_300_000_000 / TOTAL_STOCK_VOL) * 100,
  sparkline: [1_000, 1_000, 1_000, 2_000, 18_000, 47_000, 47_300],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get('market') ?? 'all';
  const range  = searchParams.get('range')  ?? '1d';
  const rangeMultiplier = range === '7d' ? 7 : range === '30d' ? 30 : 1;

  const sp500 = generateSP500MockData(TOTAL_STOCK_VOL);

  // Merge SPCX into sp500 (replace if exists, else prepend)
  const sp500WithSPCX = [SPCX_ROW, ...sp500.filter((s) => s.symbol !== 'SPCX')];

  const allAssets = [...CRYPTO_ASSETS, ...sp500WithSPCX];

  const filtered = market === 'all'
    ? allAssets
    : allAssets.filter((a) => a.market === market);

  const items = filtered
    .sort((a, b) => b.volume_usd - a.volume_usd)
    .map((d, i) => ({
      rank: i + 1,
      ...d,
      volume_usd: Math.round(d.volume_usd * rangeMultiplier),
    }));

  const cryptoTotal = CRYPTO_ASSETS.reduce((s, a) => s + a.volume_usd, 0) * rangeMultiplier;

  return NextResponse.json({
    items,
    total_crypto_volume: Math.round(cryptoTotal),
    total_stock_volume: Math.round(TOTAL_STOCK_VOL * rangeMultiplier),
    updated_at: new Date().toISOString(),
    range,
    count: items.length,
  });
}
