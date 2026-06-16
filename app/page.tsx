'use client';

import { useEffect, useState } from 'react';
import { VolumeTable, AssetRow } from '@/components/VolumeTable';
import { MarketSelector } from '@/components/MarketSelector';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { MarketSummaryBar } from '@/components/MarketSummaryBar';

interface LeaderboardResponse {
  items: AssetRow[];
  total_crypto_volume: number;
  total_stock_volume: number;
  updated_at: string;
}

export default function HomePage() {
  const [market, setMarket] = useState('all');
  const [range, setRange] = useState('1d');
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?market=${market}&range=${range}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [market, range]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Volume Radar</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time volume spikes across Crypto & US Stocks</p>
      </div>

      {data && (
        <MarketSummaryBar
          totalCryptoVolume={data.total_crypto_volume}
          totalStockVolume={data.total_stock_volume}
          updatedAt={data.updated_at}
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <MarketSelector value={market} onChange={setMarket} />
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
      ) : data ? (
        <VolumeTable data={data.items} />
      ) : (
        <div className="flex items-center justify-center h-64 text-red-400">Failed to load data</div>
      )}
    </div>
  );
}
