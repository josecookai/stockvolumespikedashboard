import axios from 'axios';

const BASE = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  total_volume: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export async function getTopCoins(limit = 100): Promise<CoinGeckoCoin[]> {
  const { data } = await axios.get(`${BASE}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      order: 'volume_desc',
      per_page: limit,
      page: 1,
    },
    timeout: 10000,
  });
  return data;
}

export async function getTotalCryptoVolume(): Promise<number> {
  try {
    const { data } = await axios.get(`${BASE}/global`, { timeout: 10000 });
    return data?.data?.total_volume?.usd ?? 0;
  } catch {
    return 0;
  }
}
