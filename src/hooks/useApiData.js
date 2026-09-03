import { useEffect, useState } from "react";

/**
 * Hook genérico para chamadas à API do dashboard.
 * Recebe uma função `fetcher` (que já deve retornar uma Promise) e a lista
 * de dependências que, ao mudar, disparam um novo fetch — tipicamente os
 * filtros globais (mês, empresa, canal...).
 */
export function useApiData(fetcher, deps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
