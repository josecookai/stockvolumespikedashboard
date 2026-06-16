function formatVolume(usd: number): string {
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(2)}T`;
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)}B`;
  return `$${(usd / 1e6).toFixed(0)}M`;
}

interface Props {
  totalCryptoVolume: number;
  totalStockVolume: number;
  updatedAt: string;
}

export function MarketSummaryBar({ totalCryptoVolume, totalStockVolume, updatedAt }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-6 px-4 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="text-gray-400">Crypto 24h Vol</span>
        <span className="font-semibold text-white">{formatVolume(totalCryptoVolume)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400" />
        <span className="text-gray-400">US Stock 24h Vol</span>
        <span className="font-semibold text-white">{formatVolume(totalStockVolume)}</span>
      </div>
      <div className="ml-auto text-xs text-gray-600">
        Updated {new Date(updatedAt).toLocaleTimeString()}
      </div>
    </div>
  );
}
