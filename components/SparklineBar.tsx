interface Props {
  data: number[];
  color?: string;
}

export function SparklineBar({ data, color = '#3b82f6' }: Props) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[2px] h-6 w-16">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm opacity-80"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, minHeight: 2 }}
        />
      ))}
    </div>
  );
}
