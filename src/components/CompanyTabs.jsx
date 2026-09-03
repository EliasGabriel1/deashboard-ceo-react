import { NavLink } from "react-router-dom";

const COMPANIES = [
  { company: "montseguro", label: "Montseguro" },
  { company: "prop5", label: "Prop5" },
  { company: "techbrabo", label: "TechBrabo" },
];

/**
 * `basePath` ex: "/empresas" ou "/comercial". Gera links para
 * `${basePath}/${company}`. Esta é a ÚNICA forma de trocar de empresa nas
 * páginas que a utilizam — não existe filtro de Empresa duplicado ao lado
 * (ver FilterBar.jsx, que esconde o seletor global nessas rotas).
 */
export default function CompanyTabs({ basePath }) {
  return (
    <nav className="flex gap-2 mt-4">
      {COMPANIES.map((c) => (
        <NavLink
          key={c.company}
          to={`${basePath}/${c.company}`}
          className={({ isActive }) =>
            `px-3 py-1.5 text-sm rounded-sm border ${
              isActive ? "bg-ink text-white border-ink" : "border-line text-muted hover:text-ink"
            }`
          }
        >
          {c.label}
        </NavLink>
      ))}
    </nav>
  );
}
