import { useEffect, useState } from "react";
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
  // Controla o menu lateral off-canvas do mobile. A sidebar de desktop
  // (md+) continua fixa e sem estado, exatamente como antes.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Fecha o drawer automaticamente ao navegar para outra rota.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-paper text-ink flex">
      <Sidebar />
      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <FilterBar onOpenNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/** Conteúdo de navegação compartilhado entre a sidebar de desktop e o drawer mobile. */
function NavLinks({ onNavigate }) {
  const location = useLocation();
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname.startsWith(item.match || item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
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
  );
}

function SidebarFooter() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="mt-auto pt-6 border-t border-white/10">
      <p className="text-sm text-white/80 truncate">{user?.display_name}</p>
      <button
        type="button"
        onClick={handleLogout}
        className="text-xs text-white/45 hover:text-white mt-1 transition-colors -m-2 p-2"
      >
        Sair
      </button>
      <p className="text-[11px] text-white/35 leading-relaxed mt-3">
        Montseguro · Prop5 · TechBrabo
      </p>
    </div>
  );
}

function Sidebar() {
  // Inalterada: continua oculta abaixo de md e visível como coluna fixa a
  // partir de md, com o mesmo visual de sempre.
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-ink text-white/90 px-6 py-8">
      <div className="mb-10">
        <p className="font-display text-2xl leading-none">Grupo Mont</p>
        <p className="text-xs text-white/50 mt-1 tracking-wide">Dashboard Executivo</p>
      </div>
      <NavLinks />
      <SidebarFooter />
    </aside>
  );
}

/**
 * Menu lateral off-canvas para telas < md. Reaproveita NAV_ITEMS e o mesmo
 * visual da sidebar de desktop (fundo ink, tipografia, estados ativos).
 * Só existe no DOM/visualmente abaixo de md (md:hidden), então não afeta o
 * desktop de forma alguma.
 */
function MobileNavDrawer({ open, onClose }) {
  return (
    <div className={`md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-ink/50 z-40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] flex flex-col bg-ink text-white/90 px-6 py-8 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className="mb-10 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-2xl leading-none">Grupo Mont</p>
            <p className="text-xs text-white/50 mt-1 tracking-wide">Dashboard Executivo</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="text-white/60 hover:text-white -m-2 p-2 text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <NavLinks onNavigate={onClose} />
        <SidebarFooter />
      </aside>
    </div>
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
function FilterBar({ onOpenNav }) {
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
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Abrir menu"
        className="md:hidden -m-2 p-2 text-ink"
      >
        <MenuIcon />
      </button>
      <span className="font-display text-lg md:hidden">Grupo Mont</span>
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
      {/*
        Padding maior por padrão (mobile) para um alvo de toque confortável;
        a partir de md volta ao padding original (py-1.5), preservando o
        desktop pixel a pixel.
      */}
      <select
        className="text-sm border border-line rounded px-2 py-2.5 md:py-1.5 bg-white text-ink disabled:opacity-50"
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
      className="md:hidden text-xs text-muted hover:text-ink ml-auto -m-2 p-2"
      onClick={() => {
        logout();
        navigate("/login", { replace: true });
      }}
    >
      Sair
    </button>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5.5H17M3 10H17M3 14.5H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
