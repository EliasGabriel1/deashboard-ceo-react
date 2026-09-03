import { NavLink, useParams } from "react-router-dom";

import DataTable from "../components/DataTable.jsx";
import FunnelChart from "../components/FunnelChart.jsx";
import KpiCard from "../components/KpiCard.jsx";
import Section from "../components/Section.jsx";
import TrendChart from "../components/TrendChart.jsx";
import { ErrorState, LoadingState } from "../components/States.jsx";
import { useFilters } from "../context/FiltersContext.jsx";
import { useApiData } from "../hooks/useApiData.js";
import { dashboardApi } from "../services/api.js";
import { formatCompactCurrency, formatNumber, formatPercent } from "../utils/format.js";

const COMPANIES = [
  { slug: "montseguro", label: "Montseguro" },
  { slug: "prop5", label: "Prop5" },
  { slug: "techbrabo", label: "TechBrabo" },
];

export default function Companies() {
  const { slug = "montseguro" } = useParams();
  const { filters } = useFilters();

  const { data, loading, error } = useApiData(
    () => dashboardApi.getCompanyDetail(slug, filters),
    [slug, filters.month, filters.channel, filters.campaign, filters.salesperson]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl">Empresas</h1>
        <p className="text-sm text-muted mt-1">Cada negócio com sua própria lógica de funil e receita.</p>
        <nav className="flex gap-2 mt-4">
          {COMPANIES.map((c) => (
            <NavLink
              key={c.slug}
              to={`/empresas/${c.slug}`}
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm rounded-sm border ${
                  isActive || (slug === c.slug)
                    ? "bg-ink text-white border-ink"
                    : "border-line text-muted hover:text-ink"
                }`
              }
            >
              {c.label}
            </NavLink>
          ))}
        </nav>
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
                label="Projeção de fechamento"
                value={formatCompactCurrency(data.overview.forecast)}
                hint={`${formatPercent(data.overview.forecast_pct)} da meta`}
              />
              <KpiCard
                label="Necessidade diária"
                value={data.overview.daily_need !== null ? formatCompactCurrency(data.overview.daily_need) : "Meta atingida"}
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
                { key: "opportunities", label: "Oportunidades", align: "right" },
                { key: "won", label: "Vendas", align: "right" },
                { key: "conversion_pct", label: "Conversão", align: "right", render: (r) => formatPercent(r.conversion_pct) },
                { key: "revenue", label: "Receita", align: "right", render: (r) => formatCompactCurrency(r.revenue) },
              ]}
              rows={data.salesperson_ranking}
            />
          </Section>
        </>
      )}
    </div>
  );
}
