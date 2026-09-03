import DataTable from "../components/DataTable.jsx";
import KpiCard from "../components/KpiCard.jsx";
import Section from "../components/Section.jsx";
import { ErrorState, LoadingState } from "../components/States.jsx";
import { useFilters } from "../context/FiltersContext.jsx";
import { useApiData } from "../hooks/useApiData.js";
import { dashboardApi } from "../services/api.js";
import { formatCompactCurrency, formatNumber, formatPercent } from "../utils/format.js";

export default function Marketing() {
  const { filters } = useFilters();
  const { data, loading, error } = useApiData(
    () => dashboardApi.getMarketing(filters),
    [filters.month, filters.company, filters.channel, filters.campaign]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl">Marketing</h1>
        <p className="text-sm text-muted mt-1">
          Relação entre investimento, aquisição e resultado comercial por canal e campanha.
        </p>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Investimento total" value={formatCompactCurrency(data.totals.investment)} />
            <KpiCard label="Leads gerados" value={formatNumber(data.totals.leads)} />
            <KpiCard label="Vendas geradas" value={formatNumber(data.totals.sales)} />
            <KpiCard label="CAC médio" value={formatCompactCurrency(data.totals.blended_cac)} hint="Investimento / vendas" />
          </div>

          <Section
            title="Campanhas"
            subtitle="Um canal com muitos leads não é necessariamente eficiente — compare até a coluna de vendas e CAC"
          >
            <DataTable
              columns={[
                { key: "campaign", label: "Campanha" },
                { key: "channel", label: "Canal" },
                { key: "company", label: "Empresa" },
                { key: "investment", label: "Investimento", align: "right", render: (r) => formatCompactCurrency(r.investment) },
                { key: "leads", label: "Leads", align: "right" },
                { key: "qualified", label: "Qualificados", align: "right" },
                { key: "meetings", label: "Reuniões", align: "right" },
                { key: "sales", label: "Vendas", align: "right" },
                { key: "revenue", label: "Receita", align: "right", render: (r) => formatCompactCurrency(r.revenue) },
                { key: "cac", label: "CAC", align: "right", render: (r) => (r.cac ? formatCompactCurrency(r.cac) : "—") },
                {
                  key: "lead_to_sale_pct",
                  label: "Conversão lead→venda",
                  align: "right",
                  render: (r) => formatPercent(r.lead_to_sale_pct),
                },
              ]}
              rows={data.rows}
            />
          </Section>
        </>
      )}
    </div>
  );
}
