import { NextResponse } from 'next/server';

const MOCK_DATA = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', market: 'crypto', price: 67420, price_change_pct: 2.3, volume_usd: 28_400_000_000, rel_volume: 1.2, market_share_pct: 28.4, sparkline: [22, 25, 24, 27, 26, 28, 28] },
  { symbol: 'SPCX', name: 'SpaceX', market: 'stock', price: 212.17, price_change_pct: 10.22, volume_usd: 47_300_000_000, rel_volume: 8.2, market_share_pct: 9.2, sparkline: [1, 1, 1, 2, 18, 47, 47] },
  { symbol: 'ETHUSDT', name: 'Ethereum', market: 'crypto', price: 3540, price_change_pct: 1.8, volume_usd: 14_200_000_000, rel_volume: 1.1, market_share_pct: 14.2, sparkline: [11, 13, 12, 14, 14, 14, 14] },
  { symbol: 'NVDA', name: 'NVIDIA', market: 'stock', price: 1082.5, price_change_pct: -0.8, volume_usd: 8_500_000_000, rel_volume: 1.4, market_share_pct: 1.7, sparkline: [6, 7, 7, 8, 9, 8, 9] },
  { symbol: 'SOLUSDT', name: 'Solana', market: 'crypto', price: 178.4, price_change_pct: 4.1, volume_usd: 5_800_000_000, rel_volume: 2.1, market_share_pct: 5.8, sparkline: [2, 3, 3, 4, 5, 5, 6] },
  { symbol: 'TSLA', name: 'Tesla', market: 'stock', price: 248.3, price_change_pct: -1.2, volume_usd: 4_200_000_000, rel_volume: 0.9, market_share_pct: 0.84, sparkline: [4, 5, 4, 4, 4, 4, 4] },
  { symbol: 'AAPL', name: 'Apple', market: 'stock', price: 213.5, price_change_pct: 0.4, volume_usd: 3_800_000_000, rel_volume: 0.8, market_share_pct: 0.76, sparkline: [4, 4, 3, 4, 4, 4, 4] },
  { symbol: 'PUMPBTCUSDT', name: 'PumpBTC', market: 'crypto', price: 0.01066, price_change_pct: 8.4, volume_usd: 850_000_000, rel_volume: 3.4, market_share_pct: 0.85, sparkline: [0.2, 0.3, 0.4, 0.5, 0.7, 0.8, 0.85] },
  { symbol: 'GRASSUSDT', name: 'Grass', market: 'crypto', price: 0.38, price_change_pct: -2.1, volume_usd: 320_000_000, rel_volume: 1.6, market_share_pct: 0.32, sparkline: [0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.32] },
  { symbol: 'META', name: 'Meta', market: 'stock', price: 542.1, price_change_pct: 1.1, volume_usd: 2_900_000_000, rel_volume: 1.0, market_share_pct: 0.58, sparkline: [3, 3, 3, 3, 3, 3, 3] },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get('market') ?? 'all';
  const range = searchParams.get('range') ?? '1d';

  const rangeMultiplier = range === '7d' ? 7 : range === '30d' ? 30 : 1;

  const items = MOCK_DATA
    .filter((d) => market === 'all' || d.market === market)
    .map((d, i) => ({
      rank: i + 1,
      ...d,
      volume_usd: d.volume_usd * rangeMultiplier,
    }));

  return NextResponse.json({
    items,
    total_crypto_volume: 100_000_000_000,
    total_stock_volume: 500_000_000_000,
    updated_at: new Date().toISOString(),
    range,
  });
}
