import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { dashboardApi } from "../services/api";

const FiltersContext = createContext(null);

function lastMonths(n) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    months.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return months;
}

export function FiltersProvider({ children }) {
  const monthOptions = useMemo(() => lastMonths(7), []);
  const [month, setMonth] = useState(monthOptions[monthOptions.length - 1].value);
  const [company, setCompany] = useState(""); // "" = todas (usado no Overview/Marketing/Insights)
  const [channel, setChannel] = useState("");
  const [campaign, setCampaign] = useState("");
  const [salesperson, setSalesperson] = useState("");

  const [options, setOptions] = useState({ companies: [], channels: [], campaigns: [], salespeople: [] });
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    dashboardApi
      .getFilterOptions()
      .then(setOptions)
      .catch(() => setOptions({ companies: [], channels: [], campaigns: [], salespeople: [] }))
      .finally(() => setLoadingOptions(false));
  }, []);

  const filters = { month, company, channel, campaign, salesperson };

  // Chave estável derivada de TODOS os filtros. Usada como dependência única
  // nos hooks de fetch de cada página (useApiData) — evita a classe de bug
  // encontrada na auditoria em que uma página deixava de reagir a um filtro
  // porque alguém esqueceu de listar aquele campo específico no array de
  // dependências do useEffect (ex: Overview e Insights não refetchavam ao
  // trocar vendedor/canal/campanha).
  const filtersKey = useMemo(() => JSON.stringify(filters), [month, company, channel, campaign, salesperson]);

  // Impede que a UI monte uma combinação impossível (ex: empresa X + vendedor
  // de outra empresa) sempre que a empresa "efetiva" muda — seja por troca no
  // seletor global, seja por troca de aba/rota nas páginas Comercial e
  // Empresas (ver useEffectiveCompany). Essa é a causa raiz corrigida do bug
  // "filtro de vendedor funciona para uns e não para outros".
  function clearMismatchedSelections(effectiveCompany) {
    if (!effectiveCompany) return;
    setSalesperson((current) => {
      if (!current) return current;
      const sp = options.salespeople.find((s) => String(s.id) === String(current));
      return sp && sp.company !== effectiveCompany ? "" : current;
    });
    setCampaign((current) => {
      if (!current) return current;
      const c = options.campaigns.find((c) => String(c.id) === String(current));
      return c && c.company !== effectiveCompany ? "" : current;
    });
  }

  const value = {
    filters,
    filtersKey,
    monthOptions,
    options,
    loadingOptions,
    setMonth,
    setCompany,
    setChannel,
    setCampaign,
    setSalesperson,
    clearMismatchedSelections,
  };

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters precisa estar dentro de <FiltersProvider>");
  return ctx;
}
