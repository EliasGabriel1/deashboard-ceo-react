import { createContext, useContext, useEffect, useState } from "react";

import { authApi, getToken, setToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "checking" evita um flash de tela de login enquanto ainda estamos
  // confirmando com o servidor se o token salvo é válido.
  const [status, setStatus] = useState("checking"); // "checking" | "authenticated" | "anonymous"

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setStatus("anonymous");
    }
    window.addEventListener("gm:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("gm:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus("anonymous");
      return;
    }
    // O token salvo no localStorage só é confiável depois de confirmado
    // pelo servidor — /api/auth/me/ é quem decide (via assinatura do
    // Django), nunca o simples fato de existir uma string no localStorage.
    authApi
      .me()
      .then(({ user }) => {
        setUser(user);
        setStatus("authenticated");
      })
      .catch(() => {
        setToken(null);
        setStatus("anonymous");
      });
  }, []);

  async function login(username, password) {
    const { token, user } = await authApi.login(username, password);
    setToken(token);
    setUser(user);
    setStatus("authenticated");
  }

  function logout() {
    setToken(null);
    setUser(null);
    setStatus("anonymous");
  }

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
