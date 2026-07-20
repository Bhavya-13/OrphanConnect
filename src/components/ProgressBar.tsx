export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{percent}% fulfilled</p>
    </div>
  );
}
