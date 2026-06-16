import TelegramBot from 'node-telegram-bot-api';
import type { SpikeResult } from '../alerts/detector';
import type { AssetVolume } from '../alerts/detector';

function getBot(): TelegramBot {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  return new TelegramBot(token);
}

function formatVolume(usd: number): string {
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(2)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(1)}M`;
  return `$${usd.toLocaleString()}`;
}

export async function sendVolumeAlert(chatId: string, spike: SpikeResult): Promise<void> {
  const bot = getBot();
  const direction = spike.price_change_pct >= 0 ? '▲' : '▼';
  const marketLabel = spike.market === 'crypto' ? 'Crypto' : 'US Stock';

  const text = [
    `🚨 *Volume Spike — ${spike.symbol}* (${marketLabel})`,
    `Volume: ${formatVolume(spike.volume_usd)} (${spike.rel_volume.toFixed(1)}× avg, +${spike.pct_above_avg.toFixed(0)}% above avg)`,
    `Market Share: ${spike.market_share_pct.toFixed(2)}% of ${marketLabel} market`,
    `Price: $${spike.price.toLocaleString()} (${direction}${Math.abs(spike.price_change_pct).toFixed(2)}%)`,
  ].join('\n');

  await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
}

export async function sendDailySummary(chatId: string, topAssets: AssetVolume[]): Promise<void> {
  const bot = getBot();
  const top5 = [...topAssets].sort((a, b) => b.rel_volume - a.rel_volume).slice(0, 5);

  const lines = top5.map(
    (a, i) =>
      `${i + 1}. *${a.symbol}* — ${a.rel_volume.toFixed(1)}× avg | $${(a.volume_usd / 1e6).toFixed(0)}M`
  );

  const text = ['📊 *VolumeWatch Daily Summary — Top Movers*', ...lines].join('\n');
  await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
}
