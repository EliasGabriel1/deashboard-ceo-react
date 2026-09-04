export default function FunnelChart({ stages }) {
  if (!stages || stages.length === 0) return null;
  const max = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-2.5">
      {stages.map((stage, idx) => {
        const width = Math.max((stage.count / max) * 100, 3);
        return (
          <div key={stage.stage} className="flex items-center gap-3">
            <span className="text-xs text-muted w-24 md:w-40 shrink-0 truncate" title={stage.label}>
              {stage.label}
            </span>
            <div className="flex-1 min-w-0 bg-paper rounded-sm h-7 relative overflow-hidden">
              <div
                className="h-full bg-accent/85 rounded-sm flex items-center justify-end px-2"
                style={{ width: `${width}%` }}
              >
                <span className="text-[11px] text-white font-medium">{stage.count}</span>
              </div>
            </div>
            <span className="text-xs text-muted w-10 md:w-14 text-right shrink-0">
              {idx === 0 ? "" : `${stage.conversion_from_previous ?? 0}%`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
