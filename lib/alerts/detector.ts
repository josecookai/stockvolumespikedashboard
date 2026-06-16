import type { AlertRule } from '../db/index';
import { canAlert, logAlert } from '../db/queries';
import { sendVolumeAlert } from '../telegram/bot';

export interface AssetVolume {
  symbol: string;
  market: 'crypto' | 'stock';
  volume_usd: number;
  rel_volume: number;
  price: number;
  price_change_pct: number;
  market_share_pct: number;
}

export interface SpikeResult {
  symbol: string;
  market: string;
  triggered: boolean;
  rel_volume: number;
  pct_above_avg: number;
  volume_usd: number;
  price: number;
  price_change_pct: number;
  market_share_pct: number;
}

export function detectSpikes(assets: AssetVolume[], thresholdX: number): SpikeResult[] {
  return assets.map((a) => ({
    symbol: a.symbol,
    market: a.market,
    triggered: a.rel_volume >= thresholdX,
    rel_volume: a.rel_volume,
    pct_above_avg: (a.rel_volume - 1) * 100,
    volume_usd: a.volume_usd,
    price: a.price,
    price_change_pct: a.price_change_pct,
    market_share_pct: a.market_share_pct,
  }));
}

const COOLDOWN_MINUTES = 30;

export async function checkAndAlert(assets: AssetVolume[], rules: AlertRule[]): Promise<{ checked: number; triggered: number }> {
  let triggered = 0;

  for (const rule of rules) {
    const targets = rule.symbol
      ? assets.filter((a) => a.symbol === rule.symbol && (!rule.market || a.market === rule.market))
      : assets.filter((a) => !rule.market || a.market === rule.market);

    const spikes = detectSpikes(targets, rule.threshold_x).filter((s) => s.triggered);

    for (const spike of spikes) {
      const ok = await canAlert(spike.symbol, COOLDOWN_MINUTES);
      if (!ok) continue;

      await sendVolumeAlert(rule.telegram_chat, spike);
      await logAlert({
        symbol: spike.symbol,
        market: spike.market,
        volume_usd: spike.volume_usd,
        rel_volume: spike.rel_volume,
      });
      triggered++;
    }
  }

  return { checked: assets.length, triggered };
}
