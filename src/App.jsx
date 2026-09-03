import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Overview from "./pages/Overview.jsx";
import Commercial from "./pages/Commercial.jsx";
import Marketing from "./pages/Marketing.jsx";
import Companies from "./pages/Companies.jsx";
import Insights from "./pages/Insights.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
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
