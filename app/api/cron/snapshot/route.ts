import { NextResponse } from 'next/server';
import { getCryptoLeaderboard } from '@/lib/data/crypto-aggregator';
import { getStocksLeaderboard } from '@/lib/data/stocks-aggregator';
import { upsertSnapshot } from '@/lib/db/queries';

export async function GET(request: Request) {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [crypto, stocks] = await Promise.all([getCryptoLeaderboard(), getStocksLeaderboard()]);

  const snapshots = [
    ...crypto.slice(0, 50).map((a) => ({
      symbol: a.symbol,
      market: 'crypto' as const,
      exchange: a.exchanges[0],
      volume_usd: a.volume_usd,
      volume_base: a.volume_base,
      price: a.price,
      price_change_pct: a.price_change_pct,
      market_share_pct: a.market_share_pct,
      rel_volume: a.rel_volume,
    })),
    ...stocks.slice(0, 50).map((s) => ({
      symbol: s.symbol,
      market: 'stock' as const,
      exchange: s.exchange,
      volume_usd: s.volume_usd,
      volume_base: s.volume_shares,
      price: s.price,
      price_change_pct: s.price_change_pct,
      market_share_pct: s.market_share_pct,
      rel_volume: s.rel_volume,
    })),
  ];

  await Promise.allSettled(snapshots.map(upsertSnapshot));

  return NextResponse.json({ saved: snapshots.length });
}
