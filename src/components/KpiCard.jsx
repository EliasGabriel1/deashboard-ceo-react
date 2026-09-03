import StatusBadge from "./StatusBadge.jsx";

/**
 * Card de indicador. `value` é o número em destaque (tratamento serif
 * grande), `hint` é uma linha secundária de contexto (ex: "meta R$ 260k").
 * `status`, quando presente, mostra o semáforo executivo.
 */
export default function KpiCard({ label, value, hint, status, trend }) {
  return (
    <div className="bg-panel border border-line rounded-sm px-5 py-4 flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase tracking-wide">{label}</span>
        {status && <StatusBadge status={status} />}
      </div>
      <span className="font-display text-3xl leading-none mt-1">{value}</span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
      {trend !== undefined && trend !== null && (
        <span className={`text-xs font-medium ${trend >= 0 ? "text-status-ok" : "text-status-risk"}`}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs mês anterior
        </span>
      )}
    </div>
  );
}
