interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: string;
}

export default function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-brand-green mt-1">{value}</p>
      {change && <p className="text-sm text-green-600 mt-1">{change}</p>}
    </div>
  );
}
