import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (status === "authenticated") {
    const redirectTo = location.state?.from || "/overview";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(location.state?.from || "/overview", { replace: true });
    } catch (err) {
      const message = err.response?.data?.detail || "Não foi possível entrar. Tente novamente.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-white leading-none">Grupo Mont</p>
          <p className="text-xs text-white/50 mt-2 tracking-wide">Dashboard Executivo</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-panel border border-line rounded-sm p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted uppercase tracking-wide block mb-1.5" htmlFor="username">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div>
            <label className="text-xs text-muted uppercase tracking-wide block mb-1.5" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-status-risk border border-status-risk/30 bg-status-risk/5 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !username || !password}
            className="mt-1 bg-ink text-white text-sm font-medium rounded-sm py-2.5 hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-[11px] text-white/35 text-center mt-5 leading-relaxed">
          Acesso de demonstração — admin / admin ou Hugo Morais / admin
        </p>
      </div>
    </div>
  );
}
