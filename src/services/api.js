import axios from "axios";

// URL da API nunca é hardcoded no código: vem de variável de ambiente do
// Vite (.env / .env.production), lida em build/runtime.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({ baseURL });

const TOKEN_KEY = "gm_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Anexa o token salvo em todas as requisições. O backend é quem realmente
// valida (assinatura do Django) — este interceptor só transporta o token,
// não é ele quem decide se o usuário está autenticado.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Se o backend responder 401 (token ausente/expirado/inválido), limpa o
// token local e avisa o AuthContext via evento global, que redireciona para
// /login. Evita ficar com um token "morto" guardado enquanto a UI segue
// tentando chamadas que sempre vão falhar.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setToken(null);
      window.dispatchEvent(new Event("gm:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export function toQuery(filters) {
  const params = {};
  if (filters.month) params.month = filters.month;
  if (filters.company) params.company = filters.company;
  if (filters.channel) params.channel = filters.channel;
  if (filters.campaign) params.campaign = filters.campaign;
  if (filters.salesperson) params.salesperson = filters.salesperson;
  return params;
}

export const authApi = {
  login: (username, password) => api.post("/auth/login/", { username, password }).then((r) => r.data),
  me: () => api.get("/auth/me/").then((r) => r.data),
};

export const dashboardApi = {
  getFilterOptions: () => api.get("/filters/").then((r) => r.data),
  getOverview: (filters) => api.get("/overview/", { params: toQuery(filters) }).then((r) => r.data),
  getCommercial: (filters) => api.get("/commercial/", { params: toQuery(filters) }).then((r) => r.data),
  getMarketing: (filters) => api.get("/marketing/", { params: toQuery(filters) }).then((r) => r.data),
  getInsights: (filters) => api.get("/insights/", { params: toQuery(filters) }).then((r) => r.data),
  getCompanyDetail: (slug, filters) =>
    api.get(`/companies/${slug}/`, { params: toQuery(filters) }).then((r) => r.data),
};
