import Section from "../components/Section.jsx";
import { EmptyState, ErrorState, LoadingState } from "../components/States.jsx";
import { useFilters } from "../context/FiltersContext.jsx";
import { useApiData } from "../hooks/useApiData.js";
import { dashboardApi } from "../services/api.js";

const SEVERITY_STYLE = {
  risco: "border-status-risk/40 bg-status-risk/5 text-status-risk",
  positivo: "border-status-ok/40 bg-status-ok/5 text-status-ok",
  default: "border-line bg-paper text-ink",
};

const TYPE_LABEL = {
  meta: "Meta",
  risco: "Risco comercial",
  marketing: "Marketing",
  positivo: "Ponto positivo",
};

export default function Insights() {
  const { filters, filtersKey } = useFilters();
  // CORREÇÃO DE AUDITORIA: dependência antiga ignorava canal/campanha/
  // vendedor, então esses filtros não recarregavam os alertas mesmo já
  // sendo aplicados pelo backend (build_insights -> funnel_data/marketing_table).
  const { data, loading, error } = useApiData(() => dashboardApi.getInsights(filters), [filtersKey]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl">Insights</h1>
        <p className="text-sm text-muted mt-1">
          Alertas gerados automaticamente a partir de regras de negócio — não é preciso ler todos os números para
          saber onde agir.
        </p>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {data && (
        <Section title={`${data.insights.length} pontos de atenção`}>
          {data.insights.length === 0 ? (
            <EmptyState message="Nenhum alerta para os filtros selecionados neste mês." />
          ) : (
            <ul className="flex flex-col gap-3">
              {data.insights.map((insight, idx) => (
                <li
                  key={idx}
                  className={`border rounded-sm px-4 py-3 text-sm ${
                    SEVERITY_STYLE[insight.severity] || SEVERITY_STYLE.default
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wide font-medium block mb-1 opacity-70">
                    {TYPE_LABEL[insight.type] || insight.type}
                  </span>
                  {insight.message}
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}
    </div>
  );
}
