/**
 * Tabela simples e genérica. `columns` é [{ key, label, align?, render? }].
 * `render(row)` permite formatar a célula; se ausente, usa row[key] direto.
 */
export default function DataTable({ columns, rows, emptyMessage = "Sem dados para os filtros atuais." }) {
  if (!rows || rows.length === 0) {
    return <p className="text-sm text-muted py-6 text-center">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto -mx-1" style={{ WebkitOverflowScrolling: "touch" }}>
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="border-b border-line text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2 text-xs text-muted font-medium uppercase tracking-wide ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id ?? idx} className="border-b border-line/60 last:border-0 hover:bg-paper/60">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-3 py-2.5 ${col.align === "right" ? "text-right tabular-nums" : ""}`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
