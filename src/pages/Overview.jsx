import { Link } from "react-router-dom";

import KpiCard from "../components/KpiCard.jsx";
import Section from "../components/Section.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import TrendChart from "../components/TrendChart.jsx";
import DataTable from "../components/DataTable.jsx";
import { ErrorState, LoadingState } from "../components/States.jsx";
import { useFilters } from "../context/FiltersContext.jsx";
import { useApiData } from "../hooks/useApiData.js";
import { dashboardApi } from "../services/api.js";
import { formatCompactCurrency, formatPercent } from "../utils/format.js";

export default function Overview() {
  const { filters } = useFilters();
  const { data, loading, error } = useApiData(
    () => dashboardApi.getOverview(filters),
    [filters.month]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl">Visão do grupo</h1>
        <p className="text-sm text-muted mt-1">
          Leitura consolidada de Montseguro, Prop5 e TechBrabo para decisão de investir, corrigir ou acelerar.
        </p>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {data && (
        <>
          <Section title="Grupo Mont" subtitle="Totais do mês, comparáveis entre as três empresas">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard
                label="Meta do grupo"
                value={formatCompactCurrency(data.group_totals.target)}
                status={data.group_totals.status}
              />
              <KpiCard label="Realizado" value={formatCompactCurrency(data.group_totals.realized)} />
              <KpiCard label="Atingimento" value={formatPercent(data.group_totals.attainment_pct)} />
              <KpiCard
                label="Projeção de fechamento"
                value={formatCompactCurrency(data.group_totals.forecast)}
                hint={`${formatPercent(data.group_totals.forecast_pct)} da meta`}
              />
            </div>
          </Section>

          <Section title="Evolução — meta x realizado" subtitle="Últimos 7 meses, soma do grupo">
            <TrendChart data={data.trend} />
          </Section>

          <Section title="Comparação entre empresas" subtitle="Cada empresa avaliada pela própria meta e ritmo — não pelo faturamento bruto">
            <DataTable
              columns={[
                {
                  key: "company_name",
                  label: "Empresa",
                  render: (r) => (
                    <Link to={`/empresas/${r.company}`} className="font-medium hover:text-accent">
                      {r.company_name}
                    </Link>
                  ),
                },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                { key: "target", label: "Meta", align: "right", render: (r) => formatCompactCurrency(r.target) },
                {
                  key: "realized",
                  label: "Realizado",
                  align: "right",
                  render: (r) => formatCompactCurrency(r.realized),
                },
                {
                  key: "attainment_pct",
                  label: "Atingimento",
                  align: "right",
                  render: (r) => formatPercent(r.attainment_pct),
                },
                {
                  key: "growth_vs_previous_month_pct",
                  label: "Crescimento",
                  align: "right",
                  render: (r) =>
                    r.growth_vs_previous_month_pct === null ? "—" : `${r.growth_vs_previous_month_pct}%`,
                },
                {
                  key: "overall_conversion_pct",
                  label: "Conversão geral",
                  align: "right",
                  render: (r) => formatPercent(r.overall_conversion_pct),
                },
                {
                  key: "open_pipeline_value",
                  label: "Pipeline ponderado",
                  align: "right",
                  render: (r) => formatCompactCurrency(r.open_pipeline_value),
                },
              ]}
              rows={data.companies}
            />
          </Section>
        </>
      )}
    </div>
  );
}
