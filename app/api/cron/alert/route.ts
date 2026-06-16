import { NextResponse } from 'next/server';
import { getCryptoLeaderboard } from '@/lib/data/crypto-aggregator';
import { getStocksLeaderboard } from '@/lib/data/stocks-aggregator';
import { getAlertRules } from '@/lib/db/queries';
import { checkAndAlert } from '@/lib/alerts/detector';

export async function GET(request: Request) {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [crypto, stocks, rules] = await Promise.all([
    getCryptoLeaderboard(),
    getStocksLeaderboard(),
    getAlertRules(),
  ]);

  const assets = [
    ...crypto.map((a) => ({
      symbol: a.symbol,
      market: 'crypto' as const,
      volume_usd: a.volume_usd,
      rel_volume: a.rel_volume,
      price: a.price,
      price_change_pct: a.price_change_pct,
      market_share_pct: a.market_share_pct,
    })),
    ...stocks.map((s) => ({
      symbol: s.symbol,
      market: 'stock' as const,
      volume_usd: s.volume_usd,
      rel_volume: s.rel_volume,
      price: s.price,
      price_change_pct: s.price_change_pct,
      market_share_pct: s.market_share_pct,
    })),
  ];

  const result = await checkAndAlert(assets, rules);
  return NextResponse.json(result);
}
