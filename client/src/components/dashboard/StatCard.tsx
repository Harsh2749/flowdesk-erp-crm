import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  accent?: string;
}

export default function StatCard({ label, value, icon, accent = '#4f46e5' }: StatCardProps) {
  return (
    <div className="merp-stat-card d-flex align-items-center gap-3">
      <div
        className="d-flex align-items-center justify-content-center rounded-3"
        style={{ width: 46, height: 46, background: `${accent}1a`, color: accent, flexShrink: 0 }}
      >
        {icon}
      </div>
      <div>
        <div className="merp-stat-value">{value}</div>
        <div className="merp-stat-label">{label}</div>
      </div>
    </div>
  );
}
