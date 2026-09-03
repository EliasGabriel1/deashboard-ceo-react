import axios from "axios";

// URL da API nunca é hardcoded no código: vem de variável de ambiente do
// Vite (.env / .env.production), lida em build/runtime.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({ baseURL });

export function toQuery(filters) {
  const params = {};
  if (filters.month) params.month = filters.month;
  if (filters.company) params.company = filters.company;
  if (filters.channel) params.channel = filters.channel;
  if (filters.campaign) params.campaign = filters.campaign;
  if (filters.salesperson) params.salesperson = filters.salesperson;
  return params;
}

export const dashboardApi = {
  getFilterOptions: () => api.get("/filters/").then((r) => r.data),
  getOverview: (filters) => api.get("/overview/", { params: toQuery(filters) }).then((r) => r.data),
  getCommercial: (filters) => api.get("/commercial/", { params: toQuery(filters) }).then((r) => r.data),
  getMarketing: (filters) => api.get("/marketing/", { params: toQuery(filters) }).then((r) => r.data),
  getInsights: (filters) => api.get("/insights/", { params: toQuery(filters) }).then((r) => r.data),
  getCompanyDetail: (slug, filters) =>
    api.get(`/companies/${slug}/`, { params: toQuery(filters) }).then((r) => r.data),
};
