export default function Section({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`bg-panel border border-line rounded-sm p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            {title && <h2 className="font-display text-xl leading-none">{title}</h2>}
            {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
