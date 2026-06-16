'use client';

import { useState } from 'react';
import { RelVolumeBadge } from './RelVolumeBadge';
import { SparklineBar } from './SparklineBar';

export interface AssetRow {
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

type SortKey = 'rank' | 'volume_usd' | 'rel_volume' | 'market_share_pct' | 'price_change_pct';

function formatVolume(usd: number): string {
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(2)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(1)}M`;
  return `$${usd.toLocaleString()}`;
}

interface Props {
  data: AssetRow[];
}

export function VolumeTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('volume_usd');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...data].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortAsc ? diff : -diff;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(false); }
  };

  const th = (label: string, key: SortKey) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white select-none"
      onClick={() => toggleSort(key)}
    >
      {label} {sortKey === key ? (sortAsc ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-900/80 sticky top-0">
          <tr>
            {th('#', 'rank')}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
            {th('Price', 'price_change_pct')}
            {th('Volume 24h', 'volume_usd')}
            {th('Rel. Volume', 'rel_volume')}
            {th('Mkt Share %', 'market_share_pct')}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">7d</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {sorted.map((row) => {
            const priceColor = row.price_change_pct >= 0 ? 'text-green-400' : 'text-red-400';
            const sparkColor = row.market === 'crypto' ? '#f59e0b' : '#3b82f6';
            return (
              <tr key={row.symbol} className="hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 text-gray-500 font-mono">{row.rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${row.market === 'crypto' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {row.market === 'crypto' ? 'CRYPTO' : 'STOCK'}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{row.symbol.replace('USDT', '')}</div>
                      <div className="text-xs text-gray-500">{row.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-mono text-white">${row.price.toLocaleString()}</div>
                  <div className={`text-xs font-mono ${priceColor}`}>
                    {row.price_change_pct >= 0 ? '+' : ''}{row.price_change_pct.toFixed(2)}%
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-white">{formatVolume(row.volume_usd)}</td>
                <td className="px-4 py-3"><RelVolumeBadge value={row.rel_volume} /></td>
                <td className="px-4 py-3 font-mono text-gray-300">{row.market_share_pct.toFixed(2)}%</td>
                <td className="px-4 py-3"><SparklineBar data={row.sparkline} color={sparkColor} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
