import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useFilters } from "../context/FiltersContext.jsx";

const NAV_ITEMS = [
  { to: "/overview", label: "CEO Overview" },
  { to: "/comercial/montseguro", label: "Comercial", match: "/comercial" },
  { to: "/marketing", label: "Marketing" },
  { to: "/empresas/montseguro", label: "Empresas", match: "/empresas" },
  { to: "/insights", label: "Insights" },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-paper text-ink flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <FilterBar />
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-ink text-white/90 px-6 py-8">
      <div className="mb-10">
        <p className="font-display text-2xl leading-none">Grupo Mont</p>
        <p className="text-xs text-white/50 mt-1 tracking-wide">Dashboard Executivo</p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.match || item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`px-3 py-2.5 rounded text-sm transition-colors border-l-2 ${
                active
                  ? "border-gold bg-white/5 text-white"
                  : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-white/10">
        <p className="text-sm text-white/80 truncate">{user?.display_name}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-white/45 hover:text-white mt-1 transition-colors"
        >
          Sair
        </button>
        <p className="text-[11px] text-white/35 leading-relaxed mt-3">
          Montseguro · Prop5 · TechBrabo
        </p>
      </div>
    </aside>
  );
}

/**
 * Barra de filtros globais.
 *
 * CORREÇÃO DE AUDITORIA: nas rotas /comercial/:company e /empresas/:company
 * a empresa é escolhida exclusivamente pelas tabs da própria página — o
 * seletor "Empresa" some daqui (`routeCompany` presente). Nessas rotas, os
 * dropdowns de Canal/Campanha/Vendedor são escopados pela empresa da URL
 * (`effectiveCompany`), nunca pelo filtro global `filters.company` (que ali
 * nem é usado). Isso elimina a causa raiz do bug em que o vendedor
 * selecionado podia pertencer a uma empresa diferente da que estava sendo
 * exibida, fazendo a query no backend retornar zero resultados.
 */
function FilterBar() {
  const {
    filters,
    monthOptions,
    options,
    loadingOptions,
    setMonth,
    setCompany,
    setChannel,
    setCampaign,
    setSalesperson,
    clearMismatchedSelections,
  } = useFilters();
  const { company: routeCompany } = useParams();

  const effectiveCompany = routeCompany || filters.company;

  // Sempre que a empresa efetivamente exibida muda (troca de aba na rota OU
  // troca no seletor global), remove qualquer vendedor/campanha selecionado
  // que não pertença mais a ela. Torna estruturalmente impossível enviar ao
  // backend uma combinação empresa+vendedor incompatível.
  useEffect(() => {
    if (!loadingOptions) clearMismatchedSelections(effectiveCompany);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCompany, loadingOptions]);

  const campaignsForCompany = options.campaigns.filter(
    (c) => !effectiveCompany || c.company === effectiveCompany
  );
  const salespeopleForCompany = options.salespeople.filter(
    (s) => !effectiveCompany || s.company === effectiveCompany
  );

  return (
    <header className="border-b border-line bg-panel px-6 md:px-10 py-3 flex flex-wrap items-center gap-3">
      <span className="font-display text-lg md:hidden mr-2">Grupo Mont</span>
      <MobileLogout />

      <Select label="Período" value={filters.month} onChange={setMonth} disabled={loadingOptions}>
        {monthOptions.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </Select>

      {!routeCompany && (
        <Select label="Empresa" value={filters.company} onChange={setCompany} disabled={loadingOptions}>
          <option value="">Todas</option>
          {options.companies.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      )}

      <Select label="Canal" value={filters.channel} onChange={setChannel} disabled={loadingOptions}>
        <option value="">Todos</option>
        {options.channels.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select label="Campanha" value={filters.campaign} onChange={setCampaign} disabled={loadingOptions}>
        <option value="">Todas</option>
        {campaignsForCompany.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select label="Vendedor" value={filters.salesperson} onChange={setSalesperson} disabled={loadingOptions}>
        <option value="">Todos</option>
        {salespeopleForCompany.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>
    </header>
  );
}

function Select({ label, value, onChange, disabled, children }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      <span className="hidden lg:inline">{label}</span>
      <select
        className="text-sm border border-line rounded px-2 py-1.5 bg-white text-ink disabled:opacity-50"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </label>
  );
}

function MobileLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="md:hidden text-xs text-muted hover:text-ink ml-auto"
      onClick={() => {
        logout();
        navigate("/login", { replace: true });
      }}
    >
      Sair
    </button>
  );
}
