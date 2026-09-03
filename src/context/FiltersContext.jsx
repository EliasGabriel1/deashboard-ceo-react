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

  const value = {
    filters,
    monthOptions,
    options,
    loadingOptions,
    setMonth,
    setCompany,
    setChannel,
    setCampaign,
    setSalesperson,
  };

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters precisa estar dentro de <FiltersProvider>");
  return ctx;
}
