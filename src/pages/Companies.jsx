import { useParams } from "react-router-dom";

import CompanyTabs from "../components/CompanyTabs.jsx";
import DataTable from "../components/DataTable.jsx";
import FunnelChart from "../components/FunnelChart.jsx";
import KpiCard from "../components/KpiCard.jsx";
import Section from "../components/Section.jsx";
import TrendChart from "../components/TrendChart.jsx";
import { ErrorState, LoadingState } from "../components/States.jsx";
import { useFilters } from "../context/FiltersContext.jsx";
import { useApiData } from "../hooks/useApiData.js";
import { dashboardApi } from "../services/api.js";
import { formatCompactCurrency, formatPercent } from "../utils/format.js";

export default function Companies() {
  const { company } = useParams();
  const { filters, filtersKey } = useFilters();

  const { data, loading, error } = useApiData(
    () => dashboardApi.getCompanyDetail(company, filters),
    [company, filtersKey]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl">Empresas</h1>
        <p className="text-sm text-muted mt-1">Cada negócio com sua própria lógica de funil e receita.</p>
        {/*
          Único ponto de seleção de empresa nesta página. O antigo seletor
          "Empresa" da barra de filtros global foi removido para esta rota
          (ver DashboardLayout.jsx) para não haver dois controles
          concorrentes decidindo a mesma coisa.
        */}
        <CompanyTabs basePath="/empresas" />
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {data && (
        <>
          <Section title={data.company.name} subtitle={data.company.tagline}>
            <p className="text-sm text-ink/80 leading-relaxed mb-5">{data.company.business_model}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard
                label="Meta do mês"
                value={formatCompactCurrency(data.overview.target)}
                status={data.overview.status}
              />
              <KpiCard label="Realizado" value={formatCompactCurrency(data.overview.realized)} />
              <KpiCard
                label="Ticket médio"
                value={formatCompactCurrency(data.overview.avg_ticket)}
                hint={`${data.overview.sales_count ?? 0} vendas fechadas no mês`}
              />
              <KpiCard
                label="Projeção de fechamento"
                value={formatCompactCurrency(data.overview.forecast)}
                hint={`${formatPercent(data.overview.forecast_pct)} da meta`}
              />
            </div>
          </Section>

          <div className="grid md:grid-cols-2 gap-6">
            <Section title="Funil" subtitle={`Ciclo médio: ${data.funnel.avg_cycle_days ?? "—"} dias`}>
              <FunnelChart stages={data.funnel.stages} />
            </Section>
            <Section title="Evolução — meta x realizado">
              <TrendChart data={data.trend} />
            </Section>
          </div>

          {data.revenue_breakdown && (
            <Section title="Receita pontual x recorrente" subtitle="Particularidade da TechBrabo">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <KpiCard label="Receita pontual (mês)" value={formatCompactCurrency(data.revenue_breakdown.one_time_revenue)} />
                <KpiCard
                  label="Nova MRR gerada (mês)"
                  value={formatCompactCurrency(data.revenue_breakdown.recurring_new_mrr)}
                  hint="Receita mensal recorrente adicionada por novos contratos"
                />
              </div>
              <p className="text-xs text-muted border-t border-line pt-3">{data.revenue_breakdown.note}</p>
            </Section>
          )}

          <Section title="Produtividade por vendedor">
            <DataTable
              columns={[
                { key: "salesperson", label: "Vendedor" },
                { key: "opportunities", label: "Oportunidades (mês)", align: "right" },
                { key: "won", label: "Vendas fechadas", align: "right" },
                { key: "conversion_pct", label: "Conversão", align: "right", render: (r) => formatPercent(r.conversion_pct) },
                { key: "revenue", label: "Receita", align: "right", render: (r) => formatCompactCurrency(r.revenue) },
                { key: "avg_ticket", label: "Ticket médio", align: "right", render: (r) => formatCompactCurrency(r.avg_ticket) },
              ]}
              rows={data.salesperson_ranking}
            />
          </Section>
        </>
      )}
    </div>
  );
}
