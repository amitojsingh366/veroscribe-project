export type AdminStat = {
  label: string;
  sub: string;
  value: string;
};

export function AdminStatsGrid({ stats }: { stats: AdminStat[] }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((stat) => (
        <AdminStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

function AdminStatCard({ stat }: { stat: AdminStat }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs text-fg-muted">{stat.label}</p>
      <p className="mt-1 text-2xl font-medium">{stat.value}</p>
      <p className="mt-0.5 text-xs text-fg-subtle">{stat.sub}</p>
    </div>
  );
}
