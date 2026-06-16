import { sql } from './index';
import type { VolumeSnapshot, AlertRule, AlertHistory } from './index';

export async function getLeaderboard(
  market: 'crypto' | 'stock' | 'all',
  range: '1d' | '7d' | '30d',
  limit = 50
) {
  const days = range === '1d' ? 1 : range === '7d' ? 7 : 30;
  if (market === 'all') {
    const { rows } = await sql`
      SELECT symbol, market, exchange,
             SUM(volume_usd) AS volume_usd,
             AVG(price) AS price,
             AVG(price_change_pct) AS price_change_pct,
             AVG(market_share_pct) AS market_share_pct,
             AVG(rel_volume) AS rel_volume,
             MAX(snapshot_at) AS last_seen
      FROM volume_snapshots
      WHERE snapshot_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY symbol, market, exchange
      ORDER BY volume_usd DESC
      LIMIT ${limit}
    `;
    return rows;
  }
  const { rows } = await sql`
    SELECT symbol, market, exchange,
           SUM(volume_usd) AS volume_usd,
           AVG(price) AS price,
           AVG(price_change_pct) AS price_change_pct,
           AVG(market_share_pct) AS market_share_pct,
           AVG(rel_volume) AS rel_volume,
           MAX(snapshot_at) AS last_seen
    FROM volume_snapshots
    WHERE market = ${market}
      AND snapshot_at >= NOW() - INTERVAL '1 day' * ${days}
    GROUP BY symbol, market, exchange
    ORDER BY volume_usd DESC
    LIMIT ${limit}
  `;
  return rows;
}

export async function getAssetHistory(symbol: string, range: '1d' | '7d' | '30d') {
  const days = range === '1d' ? 1 : range === '7d' ? 7 : 30;
  const { rows } = await sql`
    SELECT symbol, market, volume_usd, price, rel_volume, market_share_pct, snapshot_at
    FROM volume_snapshots
    WHERE symbol = ${symbol}
      AND snapshot_at >= NOW() - INTERVAL '1 day' * ${days}
    ORDER BY snapshot_at ASC
  `;
  return rows;
}

export async function getMarketTotals(market: string, date: string) {
  const { rows } = await sql`
    SELECT SUM(volume_usd_total) AS total_volume
    FROM daily_volume_summary
    WHERE market = ${market} AND date = ${date}
  `;
  return rows[0]?.total_volume ?? 0;
}

export async function upsertSnapshot(data: VolumeSnapshot) {
  await sql`
    INSERT INTO volume_snapshots
      (symbol, market, exchange, volume_usd, volume_base, price, price_change_pct, market_share_pct, rel_volume)
    VALUES
      (${data.symbol}, ${data.market}, ${data.exchange ?? null}, ${data.volume_usd},
       ${data.volume_base ?? null}, ${data.price ?? null}, ${data.price_change_pct ?? null},
       ${data.market_share_pct ?? null}, ${data.rel_volume ?? 1.0})
  `;
}

export async function getAlertRules(): Promise<AlertRule[]> {
  const { rows } = await sql`
    SELECT id, symbol, market, threshold_x, telegram_chat, enabled, created_at
    FROM alert_rules
    WHERE enabled = TRUE
  `;
  return rows as AlertRule[];
}

export async function logAlert(data: AlertHistory) {
  await sql`
    INSERT INTO alert_history (symbol, market, volume_usd, rel_volume)
    VALUES (${data.symbol}, ${data.market}, ${data.volume_usd}, ${data.rel_volume})
  `;
}

export async function canAlert(symbol: string, cooldownMinutes: number): Promise<boolean> {
  const { rows } = await sql`
    SELECT triggered_at FROM alert_history
    WHERE symbol = ${symbol}
    ORDER BY triggered_at DESC
    LIMIT 1
  `;
  if (rows.length === 0) return true;
  const last = new Date(rows[0].triggered_at).getTime();
  return Date.now() - last >= cooldownMinutes * 60 * 1000;
}
