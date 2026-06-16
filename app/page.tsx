'use client';

import { useEffect, useState, useCallback } from 'react';
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

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`/api/leaderboard?market=${market}&range=${range}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [market, range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Volume Radar</h1>
          <p className="text-gray-500 text-sm mt-0.5">Real-time volume spikes across Crypto &amp; US Stocks</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-3 py-2 rounded-lg transition-colors"
        >
          <span className={loading ? 'animate-spin' : ''}>↻</span>
          Refresh
        </button>
      </div>

      {/* Market Summary */}
      {data && (
        <MarketSummaryBar
          totalCryptoVolume={data.total_crypto_volume}
          totalStockVolume={data.total_stock_volume}
          updatedAt={data.updated_at}
        />
      )}

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <MarketSelector value={market} onChange={setMarket} />
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-600">
          <div className="w-6 h-6 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm">Loading volume data...</span>
        </div>
      ) : data ? (
        <VolumeTable data={data.items} />
      ) : (
        <div className="flex items-center justify-center h-64 text-red-400 text-sm">
          Failed to load data — check API connection
        </div>
      )}
    </div>
  );
}
