interface Props {
  value: number;
}

export function RelVolumeBadge({ value }: Props) {
  const color =
    value >= 3 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
    value >= 1.5 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
    'bg-gray-500/20 text-gray-400 border-gray-500/30';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold border ${color}`}>
      {value.toFixed(1)}×
    </span>
  );
}
