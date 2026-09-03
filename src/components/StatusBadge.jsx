const STATUS_MAP = {
  verde: { label: "No ritmo", color: "bg-status-ok" },
  amarelo: { label: "Atenção", color: "bg-status-watch" },
  vermelho: { label: "Risco", color: "bg-status-risk" },
  sem_dado: { label: "Sem meta", color: "bg-status-unknown" },
};

export default function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || STATUS_MAP.sem_dado;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/80">
      <span className={`w-2 h-2 rounded-full ${info.color}`} />
      {info.label}
    </span>
  );
}
