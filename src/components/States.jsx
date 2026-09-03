export function LoadingState({ label = "Carregando dados..." }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted py-10 justify-center">
      <span className="w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({ message = "Não foi possível carregar os dados." }) {
  return (
    <div className="border border-status-risk/30 bg-status-risk/5 text-status-risk text-sm rounded-sm px-4 py-3">
      {message} Verifique se a API está no ar e tente novamente.
    </div>
  );
}

export function EmptyState({ message = "Nenhum dado encontrado para os filtros selecionados." }) {
  return (
    <div className="border border-dashed border-line text-muted text-sm rounded-sm px-4 py-8 text-center">
      {message}
    </div>
  );
}
