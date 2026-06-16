import { NextResponse } from 'next/server';

interface AssetRow {
  rank: number;
  symbol: string;
  name: string;
  market: 'crypto' | 'stock';
  price: number;
  price_change_pct: number;
  volume_usd: number;
  rel_volume: number;
  market_share_pct: number;
  sparkline: number[];
}

function spark(base: number, trend: 'up' | 'down' | 'flat' | 'spike'): number[] {
  const arr = Array.from({ length: 7 }, (_, i) => {
    if (trend === 'spike') return i === 6 ? base : base * (0.3 + Math.random() * 0.2);
    if (trend === 'up') return base * (0.6 + i * 0.07 + Math.random() * 0.05);
    if (trend === 'down') return base * (1.1 - i * 0.05 + Math.random() * 0.05);
    return base * (0.85 + Math.random() * 0.3);
  });
  return arr.map((v) => Math.max(0, v));
}

const CRYPTO_ASSETS: Omit<AssetRow, 'rank'>[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', market: 'crypto', price: 67420, price_change_pct: 2.3, volume_usd: 28_400_000_000, rel_volume: 1.2, market_share_pct: 28.4, sparkline: spark(28, 'up') },
  { symbol: 'ETHUSDT', name: 'Ethereum', market: 'crypto', price: 3540, price_change_pct: 1.8, volume_usd: 14_200_000_000, rel_volume: 1.1, market_share_pct: 14.2, sparkline: spark(14, 'flat') },
  { symbol: 'SOLUSDT', name: 'Solana', market: 'crypto', price: 178.4, price_change_pct: 4.1, volume_usd: 5_800_000_000, rel_volume: 2.1, market_share_pct: 5.8, sparkline: spark(5, 'up') },
  { symbol: 'XRPUSDT', name: 'XRP', market: 'crypto', price: 0.62, price_change_pct: -1.2, volume_usd: 4_100_000_000, rel_volume: 0.9, market_share_pct: 4.1, sparkline: spark(4, 'down') },
  { symbol: 'DOGEUSDT', name: 'Dogecoin', market: 'crypto', price: 0.18, price_change_pct: 6.3, volume_usd: 3_900_000_000, rel_volume: 3.2, market_share_pct: 3.9, sparkline: spark(3, 'spike') },
  { symbol: 'BNBUSDT', name: 'BNB', market: 'crypto', price: 612, price_change_pct: 0.9, volume_usd: 2_800_000_000, rel_volume: 1.0, market_share_pct: 2.8, sparkline: spark(2.8, 'flat') },
  { symbol: 'ADAUSDT', name: 'Cardano', market: 'crypto', price: 0.48, price_change_pct: 3.2, volume_usd: 1_200_000_000, rel_volume: 1.4, market_share_pct: 1.2, sparkline: spark(1.2, 'up') },
  { symbol: 'AVAXUSDT', name: 'Avalanche', market: 'crypto', price: 38.5, price_change_pct: 5.1, volume_usd: 980_000_000, rel_volume: 1.8, market_share_pct: 0.98, sparkline: spark(0.98, 'up') },
  { symbol: 'LINKUSDT', name: 'Chainlink', market: 'crypto', price: 16.2, price_change_pct: 2.7, volume_usd: 870_000_000, rel_volume: 1.3, market_share_pct: 0.87, sparkline: spark(0.87, 'flat') },
  { symbol: 'PUMPBTCUSDT', name: 'PumpBTC', market: 'crypto', price: 0.01066, price_change_pct: 8.4, volume_usd: 850_000_000, rel_volume: 3.4, market_share_pct: 0.85, sparkline: spark(0.85, 'spike') },
  { symbol: 'DOTUSDT', name: 'Polkadot', market: 'crypto', price: 7.8, price_change_pct: 1.5, volume_usd: 640_000_000, rel_volume: 1.0, market_share_pct: 0.64, sparkline: spark(0.64, 'flat') },
  { symbol: 'MATICUSDT', name: 'Polygon', market: 'crypto', price: 0.68, price_change_pct: -0.5, volume_usd: 520_000_000, rel_volume: 0.8, market_share_pct: 0.52, sparkline: spark(0.52, 'down') },
  { symbol: 'SUIUSDT', name: 'Sui', market: 'crypto', price: 3.82, price_change_pct: 7.2, volume_usd: 490_000_000, rel_volume: 2.6, market_share_pct: 0.49, sparkline: spark(0.49, 'spike') },
  { symbol: 'WIFUSDT', name: 'dogwifhat', market: 'crypto', price: 2.14, price_change_pct: 12.4, volume_usd: 450_000_000, rel_volume: 4.1, market_share_pct: 0.45, sparkline: spark(0.45, 'spike') },
  { symbol: 'GRASSUSDT', name: 'Grass', market: 'crypto', price: 0.38, price_change_pct: -2.1, volume_usd: 320_000_000, rel_volume: 1.6, market_share_pct: 0.32, sparkline: spark(0.32, 'down') },
  { symbol: 'JUPUSDT', name: 'Jupiter', market: 'crypto', price: 0.92, price_change_pct: 3.8, volume_usd: 290_000_000, rel_volume: 1.4, market_share_pct: 0.29, sparkline: spark(0.29, 'up') },
  { symbol: 'PENDLEUSDT', name: 'Pendle', market: 'crypto', price: 5.42, price_change_pct: 9.1, volume_usd: 260_000_000, rel_volume: 3.8, market_share_pct: 0.26, sparkline: spark(0.26, 'spike') },
  { symbol: 'ENAUSDT', name: 'Ethena', market: 'crypto', price: 0.38, price_change_pct: 4.2, volume_usd: 240_000_000, rel_volume: 1.9, market_share_pct: 0.24, sparkline: spark(0.24, 'up') },
  { symbol: 'A8USDT', name: 'Ancient8', market: 'crypto', price: 0.0078, price_change_pct: -3.4, volume_usd: 95_000_000, rel_volume: 1.2, market_share_pct: 0.095, sparkline: spark(0.095, 'flat') },
  { symbol: 'NEARUSDT', name: 'NEAR Protocol', market: 'crypto', price: 6.1, price_change_pct: 1.9, volume_usd: 88_000_000, rel_volume: 0.9, market_share_pct: 0.088, sparkline: spark(0.088, 'flat') },
];

const STOCK_ASSETS: Omit<AssetRow, 'rank'>[] = [
  { symbol: 'SPCX', name: 'SpaceX', market: 'stock', price: 212.17, price_change_pct: 10.22, volume_usd: 47_300_000_000, rel_volume: 8.2, market_share_pct: 9.2, sparkline: spark(47, 'spike') },
  { symbol: 'NVDA', name: 'NVIDIA', market: 'stock', price: 1082.5, price_change_pct: -0.8, volume_usd: 8_500_000_000, rel_volume: 1.4, market_share_pct: 1.7, sparkline: spark(8.5, 'flat') },
  { symbol: 'TSLA', name: 'Tesla', market: 'stock', price: 248.3, price_change_pct: -1.2, volume_usd: 4_200_000_000, rel_volume: 0.9, market_share_pct: 0.84, sparkline: spark(4.2, 'down') },
  { symbol: 'AAPL', name: 'Apple', market: 'stock', price: 213.5, price_change_pct: 0.4, volume_usd: 3_800_000_000, rel_volume: 0.8, market_share_pct: 0.76, sparkline: spark(3.8, 'flat') },
  { symbol: 'META', name: 'Meta', market: 'stock', price: 542.1, price_change_pct: 1.1, volume_usd: 2_900_000_000, rel_volume: 1.0, market_share_pct: 0.58, sparkline: spark(2.9, 'flat') },
  { symbol: 'AMZN', name: 'Amazon', market: 'stock', price: 184.2, price_change_pct: 0.6, volume_usd: 2_700_000_000, rel_volume: 1.0, market_share_pct: 0.54, sparkline: spark(2.7, 'flat') },
  { symbol: 'MSFT', name: 'Microsoft', market: 'stock', price: 418.3, price_change_pct: 0.3, volume_usd: 2_400_000_000, rel_volume: 0.9, market_share_pct: 0.48, sparkline: spark(2.4, 'flat') },
  { symbol: 'AMD', name: 'AMD', market: 'stock', price: 162.4, price_change_pct: 2.1, volume_usd: 2_200_000_000, rel_volume: 1.3, market_share_pct: 0.44, sparkline: spark(2.2, 'up') },
  { symbol: 'GOOGL', name: 'Alphabet', market: 'stock', price: 178.9, price_change_pct: 0.8, volume_usd: 2_100_000_000, rel_volume: 1.0, market_share_pct: 0.42, sparkline: spark(2.1, 'flat') },
  { symbol: 'PLTR', name: 'Palantir', market: 'stock', price: 24.8, price_change_pct: 4.2, volume_usd: 1_900_000_000, rel_volume: 2.1, market_share_pct: 0.38, sparkline: spark(1.9, 'up') },
  { symbol: 'BAC', name: 'Bank of America', market: 'stock', price: 38.7, price_change_pct: 0.5, volume_usd: 1_800_000_000, rel_volume: 1.0, market_share_pct: 0.36, sparkline: spark(1.8, 'flat') },
  { symbol: 'F', name: 'Ford', market: 'stock', price: 12.4, price_change_pct: -0.8, volume_usd: 1_700_000_000, rel_volume: 1.1, market_share_pct: 0.34, sparkline: spark(1.7, 'flat') },
  { symbol: 'INTC', name: 'Intel', market: 'stock', price: 31.2, price_change_pct: -1.5, volume_usd: 1_600_000_000, rel_volume: 0.9, market_share_pct: 0.32, sparkline: spark(1.6, 'down') },
  { symbol: 'SOFI', name: 'SoFi Technologies', market: 'stock', price: 8.9, price_change_pct: 3.4, volume_usd: 1_500_000_000, rel_volume: 1.8, market_share_pct: 0.30, sparkline: spark(1.5, 'up') },
  { symbol: 'MSTR', name: 'MicroStrategy', market: 'stock', price: 1420.0, price_change_pct: 5.1, volume_usd: 1_400_000_000, rel_volume: 2.4, market_share_pct: 0.28, sparkline: spark(1.4, 'spike') },
  { symbol: 'GME', name: 'GameStop', market: 'stock', price: 28.4, price_change_pct: 8.7, volume_usd: 1_350_000_000, rel_volume: 4.2, market_share_pct: 0.27, sparkline: spark(1.35, 'spike') },
  { symbol: 'RIVN', name: 'Rivian', market: 'stock', price: 14.2, price_change_pct: 2.8, volume_usd: 1_200_000_000, rel_volume: 1.5, market_share_pct: 0.24, sparkline: spark(1.2, 'up') },
  { symbol: 'NIO', name: 'NIO', market: 'stock', price: 5.6, price_change_pct: -2.1, volume_usd: 1_100_000_000, rel_volume: 0.8, market_share_pct: 0.22, sparkline: spark(1.1, 'down') },
  { symbol: 'SNAP', name: 'Snap', market: 'stock', price: 12.8, price_change_pct: 1.4, volume_usd: 1_050_000_000, rel_volume: 1.2, market_share_pct: 0.21, sparkline: spark(1.05, 'flat') },
  { symbol: 'UBER', name: 'Uber', market: 'stock', price: 72.3, price_change_pct: 0.9, volume_usd: 980_000_000, rel_volume: 1.0, market_share_pct: 0.196, sparkline: spark(0.98, 'flat') },
  { symbol: 'COIN', name: 'Coinbase', market: 'stock', price: 218.4, price_change_pct: 3.8, volume_usd: 940_000_000, rel_volume: 1.7, market_share_pct: 0.188, sparkline: spark(0.94, 'up') },
  { symbol: 'HOOD', name: 'Robinhood', market: 'stock', price: 22.1, price_change_pct: 5.2, volume_usd: 920_000_000, rel_volume: 2.3, market_share_pct: 0.184, sparkline: spark(0.92, 'spike') },
  { symbol: 'SHOP', name: 'Shopify', market: 'stock', price: 68.4, price_change_pct: 1.2, volume_usd: 890_000_000, rel_volume: 1.1, market_share_pct: 0.178, sparkline: spark(0.89, 'flat') },
  { symbol: 'PYPL', name: 'PayPal', market: 'stock', price: 62.8, price_change_pct: 0.4, volume_usd: 860_000_000, rel_volume: 0.9, market_share_pct: 0.172, sparkline: spark(0.86, 'flat') },
  { symbol: 'SQ', name: 'Block', market: 'stock', price: 68.5, price_change_pct: 2.1, volume_usd: 830_000_000, rel_volume: 1.3, market_share_pct: 0.166, sparkline: spark(0.83, 'up') },
  { symbol: 'NFLX', name: 'Netflix', market: 'stock', price: 624.8, price_change_pct: 0.7, volume_usd: 810_000_000, rel_volume: 0.9, market_share_pct: 0.162, sparkline: spark(0.81, 'flat') },
  { symbol: 'DIS', name: 'Disney', market: 'stock', price: 108.4, price_change_pct: -0.3, volume_usd: 790_000_000, rel_volume: 0.9, market_share_pct: 0.158, sparkline: spark(0.79, 'flat') },
  { symbol: 'ABNB', name: 'Airbnb', market: 'stock', price: 142.6, price_change_pct: 1.8, volume_usd: 760_000_000, rel_volume: 1.2, market_share_pct: 0.152, sparkline: spark(0.76, 'up') },
  { symbol: 'LYFT', name: 'Lyft', market: 'stock', price: 14.8, price_change_pct: 2.4, volume_usd: 740_000_000, rel_volume: 1.4, market_share_pct: 0.148, sparkline: spark(0.74, 'up') },
  { symbol: 'RBLX', name: 'Roblox', market: 'stock', price: 38.2, price_change_pct: 3.1, volume_usd: 720_000_000, rel_volume: 1.6, market_share_pct: 0.144, sparkline: spark(0.72, 'up') },
  { symbol: 'SPOT', name: 'Spotify', market: 'stock', price: 318.4, price_change_pct: 1.4, volume_usd: 700_000_000, rel_volume: 1.1, market_share_pct: 0.14, sparkline: spark(0.7, 'flat') },
  { symbol: 'PINS', name: 'Pinterest', market: 'stock', price: 32.6, price_change_pct: 2.8, volume_usd: 680_000_000, rel_volume: 1.5, market_share_pct: 0.136, sparkline: spark(0.68, 'up') },
  { symbol: 'NET', name: 'Cloudflare', market: 'stock', price: 84.2, price_change_pct: 1.9, volume_usd: 660_000_000, rel_volume: 1.3, market_share_pct: 0.132, sparkline: spark(0.66, 'up') },
  { symbol: 'DKNG', name: 'DraftKings', market: 'stock', price: 42.8, price_change_pct: 4.6, volume_usd: 640_000_000, rel_volume: 2.0, market_share_pct: 0.128, sparkline: spark(0.64, 'spike') },
  { symbol: 'AFRM', name: 'Affirm', market: 'stock', price: 36.4, price_change_pct: 3.2, volume_usd: 620_000_000, rel_volume: 1.7, market_share_pct: 0.124, sparkline: spark(0.62, 'up') },
  { symbol: 'ROKU', name: 'Roku', market: 'stock', price: 64.8, price_change_pct: -1.4, volume_usd: 600_000_000, rel_volume: 0.8, market_share_pct: 0.12, sparkline: spark(0.6, 'down') },
  { symbol: 'TTWO', name: 'Take-Two', market: 'stock', price: 162.4, price_change_pct: 0.8, volume_usd: 580_000_000, rel_volume: 1.0, market_share_pct: 0.116, sparkline: spark(0.58, 'flat') },
  { symbol: 'CRWD', name: 'CrowdStrike', market: 'stock', price: 348.6, price_change_pct: 2.4, volume_usd: 560_000_000, rel_volume: 1.2, market_share_pct: 0.112, sparkline: spark(0.56, 'up') },
  { symbol: 'ZM', name: 'Zoom', market: 'stock', price: 68.4, price_change_pct: -0.6, volume_usd: 540_000_000, rel_volume: 0.8, market_share_pct: 0.108, sparkline: spark(0.54, 'flat') },
  { symbol: 'TWLO', name: 'Twilio', market: 'stock', price: 58.6, price_change_pct: 1.4, volume_usd: 520_000_000, rel_volume: 1.1, market_share_pct: 0.104, sparkline: spark(0.52, 'flat') },
  { symbol: 'SNOW', name: 'Snowflake', market: 'stock', price: 148.4, price_change_pct: 1.8, volume_usd: 500_000_000, rel_volume: 1.2, market_share_pct: 0.10, sparkline: spark(0.5, 'up') },
  { symbol: 'DOCN', name: 'DigitalOcean', market: 'stock', price: 38.2, price_change_pct: 2.1, volume_usd: 480_000_000, rel_volume: 1.3, market_share_pct: 0.096, sparkline: spark(0.48, 'up') },
  { symbol: 'OKTA', name: 'Okta', market: 'stock', price: 82.4, price_change_pct: 0.9, volume_usd: 460_000_000, rel_volume: 1.0, market_share_pct: 0.092, sparkline: spark(0.46, 'flat') },
  { symbol: 'DDOG', name: 'Datadog', market: 'stock', price: 124.6, price_change_pct: 2.3, volume_usd: 440_000_000, rel_volume: 1.3, market_share_pct: 0.088, sparkline: spark(0.44, 'up') },
  { symbol: 'RDFN', name: 'Redfin', market: 'stock', price: 8.4, price_change_pct: 3.8, volume_usd: 420_000_000, rel_volume: 1.9, market_share_pct: 0.084, sparkline: spark(0.42, 'up') },
  { symbol: 'OPEN', name: 'Opendoor', market: 'stock', price: 3.2, price_change_pct: 5.4, volume_usd: 400_000_000, rel_volume: 2.4, market_share_pct: 0.08, sparkline: spark(0.4, 'spike') },
  { symbol: 'LCID', name: 'Lucid Group', market: 'stock', price: 2.8, price_change_pct: -1.8, volume_usd: 380_000_000, rel_volume: 0.7, market_share_pct: 0.076, sparkline: spark(0.38, 'down') },
  { symbol: 'XPEV', name: 'XPeng', market: 'stock', price: 9.4, price_change_pct: -2.4, volume_usd: 360_000_000, rel_volume: 0.8, market_share_pct: 0.072, sparkline: spark(0.36, 'down') },
  { symbol: 'LI', name: 'Li Auto', market: 'stock', price: 22.8, price_change_pct: -1.2, volume_usd: 340_000_000, rel_volume: 0.9, market_share_pct: 0.068, sparkline: spark(0.34, 'flat') },
  { symbol: 'BIDU', name: 'Baidu', market: 'stock', price: 92.4, price_change_pct: 1.6, volume_usd: 320_000_000, rel_volume: 1.1, market_share_pct: 0.064, sparkline: spark(0.32, 'flat') },
  { symbol: 'JD', name: 'JD.com', market: 'stock', price: 28.6, price_change_pct: 0.8, volume_usd: 300_000_000, rel_volume: 0.9, market_share_pct: 0.06, sparkline: spark(0.3, 'flat') },
  { symbol: 'BABA', name: 'Alibaba', market: 'stock', price: 84.2, price_change_pct: 1.4, volume_usd: 290_000_000, rel_volume: 1.0, market_share_pct: 0.058, sparkline: spark(0.29, 'flat') },
  { symbol: 'PDD', name: 'PDD Holdings', market: 'stock', price: 148.6, price_change_pct: 2.1, volume_usd: 280_000_000, rel_volume: 1.1, market_share_pct: 0.056, sparkline: spark(0.28, 'up') },
  { symbol: 'TMUS', name: 'T-Mobile', market: 'stock', price: 194.8, price_change_pct: 0.4, volume_usd: 270_000_000, rel_volume: 0.9, market_share_pct: 0.054, sparkline: spark(0.27, 'flat') },
  { symbol: 'VZ', name: 'Verizon', market: 'stock', price: 40.2, price_change_pct: -0.2, volume_usd: 260_000_000, rel_volume: 0.9, market_share_pct: 0.052, sparkline: spark(0.26, 'flat') },
  { symbol: 'T', name: 'AT&T', market: 'stock', price: 18.4, price_change_pct: 0.1, volume_usd: 250_000_000, rel_volume: 0.9, market_share_pct: 0.05, sparkline: spark(0.25, 'flat') },
  { symbol: 'WMT', name: 'Walmart', market: 'stock', price: 68.4, price_change_pct: 0.3, volume_usd: 240_000_000, rel_volume: 0.8, market_share_pct: 0.048, sparkline: spark(0.24, 'flat') },
  { symbol: 'TGT', name: 'Target', market: 'stock', price: 142.6, price_change_pct: -0.4, volume_usd: 230_000_000, rel_volume: 0.8, market_share_pct: 0.046, sparkline: spark(0.23, 'flat') },
  { symbol: 'COST', name: 'Costco', market: 'stock', price: 892.4, price_change_pct: 0.6, volume_usd: 220_000_000, rel_volume: 0.9, market_share_pct: 0.044, sparkline: spark(0.22, 'flat') },
  { symbol: 'KO', name: 'Coca-Cola', market: 'stock', price: 62.8, price_change_pct: 0.2, volume_usd: 210_000_000, rel_volume: 0.8, market_share_pct: 0.042, sparkline: spark(0.21, 'flat') },
  { symbol: 'PEP', name: 'PepsiCo', market: 'stock', price: 168.4, price_change_pct: 0.1, volume_usd: 200_000_000, rel_volume: 0.8, market_share_pct: 0.04, sparkline: spark(0.2, 'flat') },
  { symbol: 'JPM', name: 'JPMorgan Chase', market: 'stock', price: 204.8, price_change_pct: 0.8, volume_usd: 195_000_000, rel_volume: 0.9, market_share_pct: 0.039, sparkline: spark(0.195, 'flat') },
  { symbol: 'GS', name: 'Goldman Sachs', market: 'stock', price: 482.6, price_change_pct: 0.9, volume_usd: 190_000_000, rel_volume: 1.0, market_share_pct: 0.038, sparkline: spark(0.19, 'flat') },
  { symbol: 'MS', name: 'Morgan Stanley', market: 'stock', price: 98.4, price_change_pct: 0.7, volume_usd: 185_000_000, rel_volume: 0.9, market_share_pct: 0.037, sparkline: spark(0.185, 'flat') },
  { symbol: 'C', name: 'Citigroup', market: 'stock', price: 62.4, price_change_pct: 0.5, volume_usd: 180_000_000, rel_volume: 0.9, market_share_pct: 0.036, sparkline: spark(0.18, 'flat') },
  { symbol: 'WFC', name: 'Wells Fargo', market: 'stock', price: 58.6, price_change_pct: 0.4, volume_usd: 175_000_000, rel_volume: 0.9, market_share_pct: 0.035, sparkline: spark(0.175, 'flat') },
  { symbol: 'V', name: 'Visa', market: 'stock', price: 278.4, price_change_pct: 0.5, volume_usd: 170_000_000, rel_volume: 0.9, market_share_pct: 0.034, sparkline: spark(0.17, 'flat') },
  { symbol: 'MA', name: 'Mastercard', market: 'stock', price: 468.6, price_change_pct: 0.6, volume_usd: 165_000_000, rel_volume: 0.9, market_share_pct: 0.033, sparkline: spark(0.165, 'flat') },
  { symbol: 'AMGN', name: 'Amgen', market: 'stock', price: 312.4, price_change_pct: 0.3, volume_usd: 160_000_000, rel_volume: 0.8, market_share_pct: 0.032, sparkline: spark(0.16, 'flat') },
  { symbol: 'GILD', name: 'Gilead Sciences', market: 'stock', price: 72.8, price_change_pct: 0.4, volume_usd: 155_000_000, rel_volume: 0.9, market_share_pct: 0.031, sparkline: spark(0.155, 'flat') },
  { symbol: 'MRNA', name: 'Moderna', market: 'stock', price: 68.4, price_change_pct: -1.2, volume_usd: 150_000_000, rel_volume: 0.8, market_share_pct: 0.03, sparkline: spark(0.15, 'down') },
  { symbol: 'PFE', name: 'Pfizer', market: 'stock', price: 28.6, price_change_pct: -0.5, volume_usd: 145_000_000, rel_volume: 0.8, market_share_pct: 0.029, sparkline: spark(0.145, 'flat') },
  { symbol: 'JNJ', name: 'Johnson & Johnson', market: 'stock', price: 148.4, price_change_pct: 0.2, volume_usd: 140_000_000, rel_volume: 0.8, market_share_pct: 0.028, sparkline: spark(0.14, 'flat') },
  { symbol: 'ABT', name: 'Abbott Labs', market: 'stock', price: 112.8, price_change_pct: 0.4, volume_usd: 135_000_000, rel_volume: 0.9, market_share_pct: 0.027, sparkline: spark(0.135, 'flat') },
  { symbol: 'CVX', name: 'Chevron', market: 'stock', price: 148.2, price_change_pct: 0.6, volume_usd: 130_000_000, rel_volume: 0.9, market_share_pct: 0.026, sparkline: spark(0.13, 'flat') },
  { symbol: 'XOM', name: 'Exxon Mobil', market: 'stock', price: 112.4, price_change_pct: 0.7, volume_usd: 125_000_000, rel_volume: 0.9, market_share_pct: 0.025, sparkline: spark(0.125, 'flat') },
  { symbol: 'BA', name: 'Boeing', market: 'stock', price: 184.6, price_change_pct: -0.8, volume_usd: 120_000_000, rel_volume: 0.8, market_share_pct: 0.024, sparkline: spark(0.12, 'flat') },
  { symbol: 'CAT', name: 'Caterpillar', market: 'stock', price: 348.2, price_change_pct: 0.5, volume_usd: 115_000_000, rel_volume: 0.9, market_share_pct: 0.023, sparkline: spark(0.115, 'flat') },
  { symbol: 'DE', name: 'Deere & Co', market: 'stock', price: 382.4, price_change_pct: 0.4, volume_usd: 110_000_000, rel_volume: 0.8, market_share_pct: 0.022, sparkline: spark(0.11, 'flat') },
  { symbol: 'GE', name: 'GE Aerospace', market: 'stock', price: 168.4, price_change_pct: 0.9, volume_usd: 108_000_000, rel_volume: 1.0, market_share_pct: 0.0216, sparkline: spark(0.108, 'flat') },
  { symbol: 'HON', name: 'Honeywell', market: 'stock', price: 198.6, price_change_pct: 0.3, volume_usd: 106_000_000, rel_volume: 0.8, market_share_pct: 0.0212, sparkline: spark(0.106, 'flat') },
  { symbol: 'LMT', name: 'Lockheed Martin', market: 'stock', price: 468.4, price_change_pct: 0.6, volume_usd: 104_000_000, rel_volume: 0.9, market_share_pct: 0.0208, sparkline: spark(0.104, 'flat') },
  { symbol: 'RTX', name: 'RTX Corp', market: 'stock', price: 114.8, price_change_pct: 0.4, volume_usd: 102_000_000, rel_volume: 0.9, market_share_pct: 0.0204, sparkline: spark(0.102, 'flat') },
  { symbol: 'UPS', name: 'UPS', market: 'stock', price: 128.4, price_change_pct: -0.3, volume_usd: 100_000_000, rel_volume: 0.8, market_share_pct: 0.02, sparkline: spark(0.1, 'flat') },
  { symbol: 'FDX', name: 'FedEx', market: 'stock', price: 242.6, price_change_pct: 0.5, volume_usd: 98_000_000, rel_volume: 0.9, market_share_pct: 0.0196, sparkline: spark(0.098, 'flat') },
  { symbol: 'NOW', name: 'ServiceNow', market: 'stock', price: 798.4, price_change_pct: 1.4, volume_usd: 96_000_000, rel_volume: 1.1, market_share_pct: 0.0192, sparkline: spark(0.096, 'up') },
  { symbol: 'CRM', name: 'Salesforce', market: 'stock', price: 278.6, price_change_pct: 0.8, volume_usd: 94_000_000, rel_volume: 0.9, market_share_pct: 0.0188, sparkline: spark(0.094, 'flat') },
  { symbol: 'ADBE', name: 'Adobe', market: 'stock', price: 398.4, price_change_pct: 0.6, volume_usd: 92_000_000, rel_volume: 0.9, market_share_pct: 0.0184, sparkline: spark(0.092, 'flat') },
  { symbol: 'ORCL', name: 'Oracle', market: 'stock', price: 128.4, price_change_pct: 1.2, volume_usd: 90_000_000, rel_volume: 1.0, market_share_pct: 0.018, sparkline: spark(0.09, 'up') },
  { symbol: 'IBM', name: 'IBM', market: 'stock', price: 184.2, price_change_pct: 0.4, volume_usd: 88_000_000, rel_volume: 0.8, market_share_pct: 0.0176, sparkline: spark(0.088, 'flat') },
  { symbol: 'QCOM', name: 'Qualcomm', market: 'stock', price: 198.4, price_change_pct: 1.1, volume_usd: 86_000_000, rel_volume: 1.0, market_share_pct: 0.0172, sparkline: spark(0.086, 'flat') },
  { symbol: 'MU', name: 'Micron', market: 'stock', price: 112.8, price_change_pct: 2.4, volume_usd: 84_000_000, rel_volume: 1.3, market_share_pct: 0.0168, sparkline: spark(0.084, 'up') },
  { symbol: 'TXN', name: 'Texas Instruments', market: 'stock', price: 194.6, price_change_pct: 0.3, volume_usd: 82_000_000, rel_volume: 0.8, market_share_pct: 0.0164, sparkline: spark(0.082, 'flat') },
  { symbol: 'LRCX', name: 'Lam Research', market: 'stock', price: 868.4, price_change_pct: 1.8, volume_usd: 80_000_000, rel_volume: 1.1, market_share_pct: 0.016, sparkline: spark(0.08, 'up') },
  { symbol: 'AMAT', name: 'Applied Materials', market: 'stock', price: 198.6, price_change_pct: 1.4, volume_usd: 78_000_000, rel_volume: 1.0, market_share_pct: 0.0156, sparkline: spark(0.078, 'up') },
  { symbol: 'KLAC', name: 'KLA Corp', market: 'stock', price: 712.4, price_change_pct: 1.2, volume_usd: 76_000_000, rel_volume: 1.0, market_share_pct: 0.0152, sparkline: spark(0.076, 'flat') },
  { symbol: 'ASML', name: 'ASML', market: 'stock', price: 842.6, price_change_pct: 0.8, volume_usd: 74_000_000, rel_volume: 0.9, market_share_pct: 0.0148, sparkline: spark(0.074, 'flat') },
  { symbol: 'ARM', name: 'Arm Holdings', market: 'stock', price: 148.2, price_change_pct: 2.1, volume_usd: 72_000_000, rel_volume: 1.2, market_share_pct: 0.0144, sparkline: spark(0.072, 'up') },
  { symbol: 'MDB', name: 'MongoDB', market: 'stock', price: 248.4, price_change_pct: 2.8, volume_usd: 70_000_000, rel_volume: 1.4, market_share_pct: 0.014, sparkline: spark(0.07, 'up') },
  { symbol: 'GTLB', name: 'GitLab', market: 'stock', price: 48.6, price_change_pct: 1.6, volume_usd: 68_000_000, rel_volume: 1.1, market_share_pct: 0.0136, sparkline: spark(0.068, 'up') },
  { symbol: 'PATH', name: 'UiPath', market: 'stock', price: 14.8, price_change_pct: 2.2, volume_usd: 66_000_000, rel_volume: 1.3, market_share_pct: 0.0132, sparkline: spark(0.066, 'up') },
  { symbol: 'AI', name: 'C3.ai', market: 'stock', price: 28.4, price_change_pct: 4.8, volume_usd: 64_000_000, rel_volume: 2.1, market_share_pct: 0.0128, sparkline: spark(0.064, 'spike') },
  { symbol: 'IONQ', name: 'IonQ', market: 'stock', price: 38.6, price_change_pct: 6.2, volume_usd: 62_000_000, rel_volume: 2.8, market_share_pct: 0.0124, sparkline: spark(0.062, 'spike') },
  { symbol: 'RGTI', name: 'Rigetti Computing', market: 'stock', price: 12.4, price_change_pct: 8.4, volume_usd: 60_000_000, rel_volume: 3.4, market_share_pct: 0.012, sparkline: spark(0.06, 'spike') },
  { symbol: 'BBAI', name: 'BigBear.ai', market: 'stock', price: 4.8, price_change_pct: 5.6, volume_usd: 58_000_000, rel_volume: 2.4, market_share_pct: 0.0116, sparkline: spark(0.058, 'spike') },
  { symbol: 'SMCI', name: 'Super Micro', market: 'stock', price: 884.6, price_change_pct: 3.4, volume_usd: 56_000_000, rel_volume: 1.6, market_share_pct: 0.0112, sparkline: spark(0.056, 'up') },
  { symbol: 'HPE', name: 'HP Enterprise', market: 'stock', price: 18.4, price_change_pct: 0.5, volume_usd: 54_000_000, rel_volume: 0.9, market_share_pct: 0.0108, sparkline: spark(0.054, 'flat') },
  { symbol: 'DELL', name: 'Dell', market: 'stock', price: 112.8, price_change_pct: 1.2, volume_usd: 52_000_000, rel_volume: 1.0, market_share_pct: 0.0104, sparkline: spark(0.052, 'flat') },
  { symbol: 'PANW', name: 'Palo Alto Networks', market: 'stock', price: 318.6, price_change_pct: 1.8, volume_usd: 50_000_000, rel_volume: 1.1, market_share_pct: 0.01, sparkline: spark(0.05, 'up') },
  { symbol: 'ZS', name: 'Zscaler', market: 'stock', price: 198.4, price_change_pct: 2.1, volume_usd: 48_000_000, rel_volume: 1.2, market_share_pct: 0.0096, sparkline: spark(0.048, 'up') },
  { symbol: 'FTNT', name: 'Fortinet', market: 'stock', price: 68.4, price_change_pct: 0.8, volume_usd: 46_000_000, rel_volume: 0.9, market_share_pct: 0.0092, sparkline: spark(0.046, 'flat') },
  { symbol: 'S', name: 'SentinelOne', market: 'stock', price: 24.8, price_change_pct: 2.4, volume_usd: 44_000_000, rel_volume: 1.3, market_share_pct: 0.0088, sparkline: spark(0.044, 'up') },
  { symbol: 'CYBR', name: 'CyberArk', market: 'stock', price: 248.6, price_change_pct: 1.6, volume_usd: 42_000_000, rel_volume: 1.1, market_share_pct: 0.0084, sparkline: spark(0.042, 'up') },
  { symbol: 'U', name: 'Unity', market: 'stock', price: 18.4, price_change_pct: 3.2, volume_usd: 40_000_000, rel_volume: 1.6, market_share_pct: 0.008, sparkline: spark(0.04, 'up') },
  { symbol: 'BMBL', name: 'Bumble', market: 'stock', price: 8.6, price_change_pct: -1.4, volume_usd: 38_000_000, rel_volume: 0.8, market_share_pct: 0.0076, sparkline: spark(0.038, 'down') },
  { symbol: 'MTCH', name: 'Match Group', market: 'stock', price: 12.4, price_change_pct: 0.8, volume_usd: 36_000_000, rel_volume: 0.9, market_share_pct: 0.0072, sparkline: spark(0.036, 'flat') },
  { symbol: 'DASH', name: 'DoorDash', market: 'stock', price: 148.6, price_change_pct: 1.4, volume_usd: 34_000_000, rel_volume: 1.0, market_share_pct: 0.0068, sparkline: spark(0.034, 'flat') },
  { symbol: 'GRAB', name: 'Grab', market: 'stock', price: 4.2, price_change_pct: 2.1, volume_usd: 32_000_000, rel_volume: 1.2, market_share_pct: 0.0064, sparkline: spark(0.032, 'up') },
  { symbol: 'SE', name: 'Sea Limited', market: 'stock', price: 68.4, price_change_pct: 1.8, volume_usd: 30_000_000, rel_volume: 1.1, market_share_pct: 0.006, sparkline: spark(0.03, 'up') },
  { symbol: 'MELI', name: 'MercadoLibre', market: 'stock', price: 1948.6, price_change_pct: 0.9, volume_usd: 28_000_000, rel_volume: 0.9, market_share_pct: 0.0056, sparkline: spark(0.028, 'flat') },
  { symbol: 'NU', name: 'Nu Holdings', market: 'stock', price: 14.8, price_change_pct: 2.4, volume_usd: 26_000_000, rel_volume: 1.3, market_share_pct: 0.0052, sparkline: spark(0.026, 'up') },
  { symbol: 'STNE', name: 'StoneCo', market: 'stock', price: 12.6, price_change_pct: 1.6, volume_usd: 24_000_000, rel_volume: 1.1, market_share_pct: 0.0048, sparkline: spark(0.024, 'flat') },
  { symbol: 'GLOB', name: 'Globant', market: 'stock', price: 148.4, price_change_pct: 0.8, volume_usd: 22_000_000, rel_volume: 0.9, market_share_pct: 0.0044, sparkline: spark(0.022, 'flat') },
  { symbol: 'PAGS', name: 'PagSeguro', market: 'stock', price: 8.4, price_change_pct: 1.2, volume_usd: 20_000_000, rel_volume: 1.0, market_share_pct: 0.004, sparkline: spark(0.02, 'flat') },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get('market') ?? 'all';
  const range = searchParams.get('range') ?? '1d';
  const rangeMultiplier = range === '7d' ? 7 : range === '30d' ? 30 : 1;

  const allAssets = [...CRYPTO_ASSETS, ...STOCK_ASSETS];

  const filtered = market === 'all'
    ? allAssets
    : allAssets.filter((a) => a.market === market);

  const items: AssetRow[] = filtered
    .sort((a, b) => b.volume_usd - a.volume_usd)
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
    count: items.length,
  });
}
