import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Login from "./pages/Login.jsx";
import Overview from "./pages/Overview.jsx";
import Commercial from "./pages/Commercial.jsx";
import Marketing from "./pages/Marketing.jsx";
import Companies from "./pages/Companies.jsx";
import Insights from "./pages/Insights.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { FiltersProvider } from "./context/FiltersContext.jsx";

function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center text-sm text-muted">
        Carregando...
      </div>
    );
  }
  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  // FiltersProvider só é montado (e só então dispara o fetch de
  // /api/filters/) depois de a autenticação ser confirmada — evita uma
  // chamada fadada a 401 disparando antes do login.
  return <FiltersProvider>{children}</FiltersProvider>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/comercial" element={<Navigate to="/comercial/montseguro" replace />} />
        <Route path="/comercial/:company" element={<Commercial />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/empresas" element={<Navigate to="/empresas/montseguro" replace />} />
        <Route path="/empresas/:company" element={<Companies />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Route>
    </Routes>
  );
}
