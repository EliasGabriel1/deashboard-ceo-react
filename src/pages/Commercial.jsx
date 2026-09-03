import DataTable from "../components/DataTable.jsx";
import FunnelChart from "../components/FunnelChart.jsx";
import KpiCard from "../components/KpiCard.jsx";
import Section from "../components/Section.jsx";
import TrendChart from "../components/TrendChart.jsx";
import { EmptyState, ErrorState, LoadingState } from "../components/States.jsx";
import { useFilters } from "../context/FiltersContext.jsx";
import { useApiData } from "../hooks/useApiData.js";
import { dashboardApi } from "../services/api.js";
import { formatCompactCurrency, formatNumber, formatPercent } from "../utils/format.js";

export default function Commercial() {
  const { filters, options } = useFilters();
  const activeCompany = filters.company || "montseguro";

  const { data, loading, error } = useApiData(
    () => dashboardApi.getCommercial({ ...filters, company: activeCompany }),
    [filters.month, activeCompany, filters.channel, filters.campaign, filters.salesperson]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl">Comercial</h1>
        <p className="text-sm text-muted mt-1">
          Funil, conversão etapa-a-etapa, pipeline e produtividade —{" "}
          {!filters.company && (
            <span>
              exibindo <strong>{options.companies.find((c) => c.slug === activeCompany)?.name || activeCompany}</strong>{" "}
              (selecione uma empresa no filtro para trocar).
            </span>
          )}
        </p>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Leads no mês" value={formatNumber(data.funnel.total_leads)} />
            <KpiCard label="Vendas" value={formatNumber(data.funnel.won)} />
            <KpiCard label="Conversão geral" value={formatPercent(data.funnel.overall_conversion_pct)} />
            <KpiCard
              label="Ciclo médio"
              value={data.funnel.avg_cycle_days !== null ? `${data.funnel.avg_cycle_days} dias` : "—"}
            />
          </div>

          <Section title="Funil comercial" subtitle="Volume por etapa e conversão em relação à etapa anterior">
            <FunnelChart stages={data.funnel.stages} />
          </Section>

          <div className="grid md:grid-cols-2 gap-6">
            <Section title="Pipeline em aberto" subtitle="Ponderado pela etapa em que cada oportunidade está">
              <div className="grid grid-cols-2 gap-4">
                <KpiCard label="Oportunidades abertas" value={formatNumber(data.pipeline.open_count)} />
                <KpiCard label="Valor potencial total" value={formatCompactCurrency(data.pipeline.total_potential_value)} />
              </div>
              <div className="mt-4">
                <KpiCard label="Valor ponderado" value={formatCompactCurrency(data.pipeline.weighted_value)} hint="Peso maior para etapas mais avançadas" />
              </div>
            </Section>

            <Section title="Evolução — meta x realizado" subtitle="Últimos 7 meses">
              <TrendChart data={data.trend} />
            </Section>
          </div>

          <Section title="Produtividade por vendedor">
            {data.salesperson_ranking.length === 0 ? (
              <EmptyState />
            ) : (
              <DataTable
                columns={[
                  { key: "salesperson", label: "Vendedor" },
                  { key: "opportunities", label: "Oportunidades", align: "right" },
                  { key: "won", label: "Vendas", align: "right" },
                  {
                    key: "conversion_pct",
                    label: "Conversão",
                    align: "right",
                    render: (r) => formatPercent(r.conversion_pct),
                  },
                  {
                    key: "revenue",
                    label: "Receita",
                    align: "right",
                    render: (r) => formatCompactCurrency(r.revenue),
                  },
                ]}
                rows={data.salesperson_ranking}
              />
            )}
          </Section>
        </>
      )}
    </div>
  );
}
