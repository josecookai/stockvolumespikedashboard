function fmt(usd: number): string {
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(2)}T`;
  if (usd >= 1e9)  return `$${(usd / 1e9).toFixed(0)}B`;
  return `$${(usd / 1e6).toFixed(0)}M`;
}

interface NasdaqSource {
  totalSharesB: number;
  totalUsdB: number;
  date: string;
}

interface CBOESource {
  nasdaqSharePct: number;
  cboeSharePct: number;
  atsSharePct: number;
}

interface Props {
  totalCryptoVolume: number;
  totalStockVolume: number;
  updatedAt: string;
  nasdaqSource?: NasdaqSource | null;
  cboeSource?: CBOESource | null;
}

function SourceTag({ label, live }: { label: string; live: boolean }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
      live
        ? 'bg-green-500/10 border-green-500/30 text-green-400'
        : 'bg-gray-700/50 border-gray-600/30 text-gray-500'
    }`}>
      {live ? '● ' : '○ '}{label}
    </span>
  );
}

export function MarketSummaryBar({ totalCryptoVolume, totalStockVolume, updatedAt, nasdaqSource, cboeSource }: Props) {
  return (
    <div className="space-y-2">
      {/* Main volume numbers */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-gray-400">Crypto 24h Vol</span>
          <span className="font-semibold text-white font-mono">{fmt(totalCryptoVolume)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-gray-400">US Stock 24h Vol</span>
          <span className="font-semibold text-white font-mono">{fmt(totalStockVolume)}</span>
          {nasdaqSource
            ? <SourceTag label="Nasdaq Trader" live />
            : <SourceTag label="SIFMA est." live={false} />
          }
        </div>

        {nasdaqSource && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{nasdaqSource.totalSharesB.toFixed(1)}B shares</span>
            <span className="text-gray-700">·</span>
            <span>as of {nasdaqSource.date}</span>
          </div>
        )}

        <div className="ml-auto text-xs text-gray-600">
          Updated {new Date(updatedAt).toLocaleTimeString()}
        </div>
      </div>

      {/* CBOE Market Share breakdown */}
      {cboeSource && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 bg-gray-900/40 border border-gray-800/60 rounded-lg text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <SourceTag label="CBOE Market Share" live />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Nasdaq:</span>
            <span className="text-white font-mono">{cboeSource.nasdaqSharePct.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">CBOE Exchanges:</span>
            <span className="text-white font-mono">{cboeSource.cboeSharePct.toFixed(1)}%</span>
          </div>
          {cboeSource.atsSharePct > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Dark Pool / ATS:</span>
              <span className="text-white font-mono">{cboeSource.atsSharePct.toFixed(1)}%</span>
            </div>
          )}
          <span className="text-gray-600 text-[10px]">Consolidated Tape incl. all exchanges + dark pools</span>
        </div>
      )}
    </div>
  );
}
