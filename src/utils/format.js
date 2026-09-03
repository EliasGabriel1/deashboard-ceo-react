export function formatCurrency(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
    value
  );
}

export function formatCompactCurrency(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value) {
  if (value === null || value === undefined) return "—";
  return `${value}%`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function monthLabel(isoMonth) {
  if (!isoMonth) return "";
  const [year, month] = isoMonth.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  const label = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
