import { NavLink, Outlet, useParams } from "react-router-dom";

import { useFilters } from "../context/FiltersContext.jsx";

const NAV_ITEMS = [
  { to: "/overview", label: "CEO Overview" },
  { to: "/comercial", label: "Comercial" },
  { to: "/marketing", label: "Marketing" },
  { to: "/empresas", label: "Empresas" },
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
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-ink text-white/90 px-6 py-8">
      <div className="mb-10">
        <p className="font-display text-2xl leading-none">Grupo Mont</p>
        <p className="text-xs text-white/50 mt-1 tracking-wide">Dashboard Executivo</p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded text-sm transition-colors border-l-2 ${
                isActive
                  ? "border-gold bg-white/5 text-white"
                  : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto text-[11px] text-white/35 leading-relaxed">
        Montseguro · Prop5 · TechBrabo
      </div>
    </aside>
  );
}

function FilterBar() {
  const { filters, monthOptions, options, loadingOptions, setMonth, setCompany, setChannel, setCampaign, setSalesperson } =
    useFilters();
  const { slug } = useParams();

  const campaignsForCompany = options.campaigns.filter(
    (c) => !filters.company || c.company === filters.company
  );
  const salespeopleForCompany = options.salespeople.filter(
    (s) => !filters.company || s.company === filters.company
  );

  return (
    <header className="border-b border-line bg-panel px-6 md:px-10 py-3 flex flex-wrap items-center gap-3">
      <span className="font-display text-lg md:hidden mr-2">Grupo Mont</span>

      <Select label="Período" value={filters.month} onChange={setMonth} disabled={loadingOptions}>
        {monthOptions.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </Select>

      {!slug && (
        <Select
          label="Empresa"
          value={filters.company}
          onChange={(v) => {
            setCompany(v);
            setChannel("");
            setCampaign("");
            setSalesperson("");
          }}
          disabled={loadingOptions}
        >
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
